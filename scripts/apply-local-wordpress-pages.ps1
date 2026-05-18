[CmdletBinding()]
param(
    [switch] $Apply,
    [switch] $CreateMissing,
    [string[]] $AllowedUrls = @('http://127.0.0.1:8088'),
    [string] $ContentRoot,
    [string] $BackupRoot
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$ScriptDirectory = if ($PSScriptRoot) {
    $PSScriptRoot
} else {
    Split-Path -Parent $MyInvocation.MyCommand.Path
}

$RepoRoot = (Resolve-Path (Join-Path $ScriptDirectory '..')).Path
$PublicHtml = Join-Path $RepoRoot 'public_html'

if ([string]::IsNullOrWhiteSpace($ContentRoot)) {
    $ContentRoot = Join-Path $RepoRoot 'content'
}

if ([string]::IsNullOrWhiteSpace($BackupRoot)) {
    $BackupRoot = Join-Path ([System.IO.Path]::GetTempPath()) 'sokatechnologies-wordpress-local-backups'
}

$ContentRoot = (Resolve-Path $ContentRoot).Path
$BackupRoot = [System.IO.Path]::GetFullPath($BackupRoot)
$DryRun = -not $Apply

if (-not (Test-Path (Join-Path $PublicHtml 'wp-load.php'))) {
    throw "No se encontro una instalacion WordPress local valida en: $PublicHtml"
}

if ($BackupRoot.StartsWith($RepoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "BackupRoot debe estar fuera del repositorio para evitar versionar respaldos: $BackupRoot"
}

$WpCommand = Get-Command wp -ErrorAction SilentlyContinue
if (-not $WpCommand) {
    throw 'WP-CLI no esta disponible en PATH. Instala o configura wp antes de aplicar paginas.'
}

$script:WpExecutable = $WpCommand.Source
if ([string]::IsNullOrWhiteSpace($script:WpExecutable)) {
    $script:WpExecutable = $WpCommand.Name
}

$Pages = @(
    [ordered]@{ Slug = 'inicio'; Title = 'Inicio'; File = 'home.html' },
    [ordered]@{ Slug = 'servicios'; Title = 'Servicios'; File = 'servicios.html' },
    [ordered]@{ Slug = 'soluciones'; Title = 'Soluciones'; File = 'soluciones.html' },
    [ordered]@{ Slug = 'sobre-nosotros'; Title = 'Sobre nosotros'; File = 'sobre-nosotros.html' },
    [ordered]@{ Slug = 'contacto'; Title = 'Contacto'; File = 'contacto.html' },
    [ordered]@{ Slug = 'casos-de-exito'; Title = 'Casos de éxito'; File = 'casos-de-exito.html' }
)

$script:ContactFormBlockToken = '%%SOKA_CONTACT_FORM_BLOCK%%'
$script:LegacyContactFormShortcodeToken = '%%SOKA_CONTACT_FORM_SHORTCODE%%'

function Invoke-WpText {
    param(
        [Parameter(Mandatory = $true)]
        [string[]] $Arguments
    )

    $output = & $script:WpExecutable @Arguments 2>&1
    $exitCode = $LASTEXITCODE
    $text = (($output | ForEach-Object { $_.ToString() }) -join "`n").Trim()

    if ($exitCode -ne 0) {
        $commandSummary = if ($Arguments.Count -gt 1) {
            "wp $($Arguments[0]) $($Arguments[1])"
        } else {
            "wp $($Arguments[0])"
        }

        throw "WP-CLI fallo ejecutando $commandSummary.`n$text"
    }

    return $text
}

function Invoke-WpEvalFileText {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Php,

        [Parameter(Mandatory = $true)]
        [string] $Name,

        [string[]] $Arguments = @()
    )

    $safeName = $Name -replace '[^A-Za-z0-9_-]', '-'
    $tempPath = Join-Path ([System.IO.Path]::GetTempPath()) "soka-wpcli-$safeName-$([System.Guid]::NewGuid()).php"
    $phpFile = "<?php`n$Php"
    $utf8NoBom = [System.Text.UTF8Encoding]::new($false)

    [System.IO.File]::WriteAllText($tempPath, $phpFile, $utf8NoBom)
    try {
        return Invoke-WpText (@('eval-file', $tempPath) + $Arguments)
    } finally {
        Remove-Item -LiteralPath $tempPath -Force -ErrorAction SilentlyContinue
    }
}

function Get-PageIdBySlugOrTitle {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Slug,

        [Parameter(Mandatory = $true)]
        [string] $Title
    )

$php = @'
$slug = $args[0];
$title = $args[1];

global $wpdb;

$published_ids = $wpdb->get_col(
    $wpdb->prepare(
        "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'page' AND post_title = %s AND post_status = 'publish' ORDER BY ID ASC LIMIT 2",
        $title
    )
);

if (count($published_ids) > 1) {
    fwrite(STDERR, "Mas de una pagina publicada coincide con el titulo '{$title}'. Resuelve duplicados manualmente.\n");
    exit(1);
}

if (count($published_ids) === 1) {
    echo (int) $published_ids[0];
    exit;
}

$page = get_page_by_path($slug, OBJECT, 'page');
if ($page && $page->post_type === 'page' && $page->post_status !== 'trash') {
    echo (int) $page->ID;
    exit;
}

$draft_ids = $wpdb->get_col(
    $wpdb->prepare(
        "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'page' AND post_title = %s AND post_status NOT IN ('trash', 'auto-draft') ORDER BY ID ASC LIMIT 2",
        $title
    )
);

if (count($draft_ids) > 1) {
    fwrite(STDERR, "Mas de una pagina no publicada coincide con el titulo '{$title}'. Ajusta el slug o resuelve duplicados manualmente.\n");
    exit(1);
}

if (count($draft_ids) === 1) {
    echo (int) $draft_ids[0];
}
'@

    $result = Invoke-WpEvalFileText -Php $php -Name 'find-page' -Arguments @($Slug, $Title)
    if ([string]::IsNullOrWhiteSpace($result)) {
        return $null
    }

    if ($result -notmatch '(\d+)\s*$') {
        throw "No se pudo interpretar el ID de la pagina '$Title'."
    }

    return [int] $Matches[1]
}

function Backup-PageContent {
    param(
        [Parameter(Mandatory = $true)]
        [int] $Id,

        [Parameter(Mandatory = $true)]
        [string] $BackupPath
    )

    $php = @'
$id = (int) $args[0];
$path = $args[1];

$post = get_post($id);
if (!$post || $post->post_type !== 'page') {
    fwrite(STDERR, "No se encontro una pagina valida para backup.\n");
    exit(1);
}

$data = array(
    'backup_type' => 'wordpress_page_content',
    'created_at_utc' => gmdate('c'),
    'page' => array(
        'ID' => (int) $post->ID,
        'post_title' => $post->post_title,
        'post_name' => $post->post_name,
        'post_status' => $post->post_status,
        'post_content' => $post->post_content,
        'comment_status' => $post->comment_status,
        'ping_status' => $post->ping_status,
    ),
);

$json = wp_json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($json === false || file_put_contents($path, $json) === false) {
    fwrite(STDERR, "No se pudo escribir el backup de contenido.\n");
    exit(1);
}
'@

    Invoke-WpEvalFileText -Php $php -Name 'backup-page' -Arguments @("$Id", $BackupPath) | Out-Null
}

function Update-PageFromFile {
    param(
        [Parameter(Mandatory = $true)]
        [int] $Id,

        [Parameter(Mandatory = $true)]
        [string] $Slug,

        [Parameter(Mandatory = $true)]
        [string] $Title,

        [Parameter(Mandatory = $true)]
        [string] $ContentPath
    )

$php = @'
$id = (int) $args[0];
$slug = $args[1];
$path = $args[2];
$title = $args[3];

$post = get_post($id);
if (!$post || $post->post_type !== 'page') {
    fwrite(STDERR, "El ID indicado no corresponde a una pagina.\n");
    exit(1);
}

$content = file_get_contents($path);
if ($content === false) {
    fwrite(STDERR, "No se pudo leer el archivo de contenido.\n");
    exit(1);
}

$result = wp_update_post(
    array(
        'ID' => $id,
        'post_name' => $slug,
        'post_title' => $title,
        'post_content' => $content,
        'post_status' => 'publish',
        'comment_status' => 'closed',
        'ping_status' => 'closed',
    ),
    true
);

if (is_wp_error($result)) {
    fwrite(STDERR, $result->get_error_message() . "\n");
    exit(1);
}

echo (int) $result;
'@

    Invoke-WpEvalFileText -Php $php -Name 'update-page' -Arguments @("$Id", $Slug, $ContentPath, $Title) | Out-Null
}

function Create-PageFromFile {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Slug,

        [Parameter(Mandatory = $true)]
        [string] $Title,

        [Parameter(Mandatory = $true)]
        [string] $ContentPath
    )

    $php = @'
$path = $args[0];
$title = $args[1];
$slug = $args[2];

$content = file_get_contents($path);
if ($content === false) {
    fwrite(STDERR, "No se pudo leer el archivo de contenido.\n");
    exit(1);
}

$result = wp_insert_post(
    array(
        'post_type' => 'page',
        'post_title' => $title,
        'post_name' => $slug,
        'post_content' => $content,
        'post_status' => 'publish',
        'comment_status' => 'closed',
        'ping_status' => 'closed',
    ),
    true
);

if (is_wp_error($result)) {
    fwrite(STDERR, $result->get_error_message() . "\n");
    exit(1);
}

echo (int) $result;
'@

    $result = Invoke-WpEvalFileText -Php $php -Name 'create-page' -Arguments @($ContentPath, $Title, $Slug)
    if ($result -notmatch '(\d+)\s*$') {
        throw "No se pudo interpretar el ID creado para '$Title'."
    }

    return [int] $Matches[1]
}

function Get-PageStatus {
    param(
        [Parameter(Mandatory = $true)]
        [int] $Id
    )

    return Invoke-WpText @('post', 'get', "$Id", '--field=post_status')
}

function Get-LocalContactFormShortcode {
    $php = @'
$shortcode = '';

if (function_exists('wpFluent') && function_exists('wpFluentForm')) {
    $managedMeta = wpFluent()->table('fluentform_form_meta')
        ->where('meta_key', '_soka_local_contact_form')
        ->where('value', 'yes')
        ->orderBy('form_id', 'asc')
        ->first();

    if ($managedMeta) {
        $form = wpFluent()->table('fluentform_forms')
            ->where('id', (int) $managedMeta->form_id)
            ->first();

        if ($form) {
            $shortcode = sprintf('[fluentform id="%d"]', (int) $form->id);
        }
    }
}

echo $shortcode;
'@

    try {
        $shortcode = Invoke-WpEvalFileText -Php $php -Name 'local-contact-form-shortcode'
        if ([string]::IsNullOrWhiteSpace($shortcode)) {
            return $null
        }

        return $shortcode.Trim()
    } catch {
        return $null
    }
}

function Get-LocalContactFormBlockMarkup {
    param(
        [string] $Shortcode
    )

    if (-not [string]::IsNullOrWhiteSpace($Shortcode)) {
        return @"
<!-- wp:shortcode -->
$Shortcode
<!-- /wp:shortcode -->
"@
    }

    return @'
<!-- wp:paragraph {"className":"soka-form-unavailable"} -->
<p class="soka-form-unavailable">Formulario en configuración. Escríbenos por <a href="https://wa.me/573107482865?text=Hola%2C%20quiero%20solicitar%20un%20diagn%C3%B3stico%20para%20SokaTechnologies.%20Quiero%20revisar%20un%20proceso%2C%20sistema%20o%20infraestructura%20de%20mi%20empresa." target="_blank" rel="noopener noreferrer">WhatsApp</a> o <a href="mailto:info@sokatechnologies.com">correo</a> para solicitar diagnóstico.</p>
<!-- /wp:paragraph -->
'@
}

function Resolve-LocalContentPath {
    param(
        [Parameter(Mandatory = $true)]
        [string] $ContentPath,

        [Parameter(Mandatory = $true)]
        [string] $ContactFormBlockMarkup
    )

    $rawContent = Get-Content -LiteralPath $ContentPath -Raw
    $hasBlockToken = $rawContent.IndexOf($script:ContactFormBlockToken, [System.StringComparison]::Ordinal) -ge 0
    $hasLegacyToken = $rawContent.IndexOf($script:LegacyContactFormShortcodeToken, [System.StringComparison]::Ordinal) -ge 0

    if (-not $hasBlockToken -and -not $hasLegacyToken) {
        return [pscustomobject]@{
            Path = $ContentPath
            IsTemp = $false
        }
    }

    $resolvedContent = $rawContent.Replace($script:ContactFormBlockToken, $ContactFormBlockMarkup)
    $resolvedContent = $resolvedContent.Replace($script:LegacyContactFormShortcodeToken, $ContactFormBlockMarkup)
    $tempPath = Join-Path ([System.IO.Path]::GetTempPath()) "soka-wordpress-content-$([System.Guid]::NewGuid()).html"
    $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
    [System.IO.File]::WriteAllText($tempPath, $resolvedContent, $utf8NoBom)

    return [pscustomobject]@{
        Path = $tempPath
        IsTemp = $true
    }
}

Push-Location $PublicHtml
try {
    Write-Host 'Verificando entorno WordPress local...'
    $siteUrl = Invoke-WpText @('option', 'get', 'siteurl')
    $homeUrl = Invoke-WpText @('option', 'get', 'home')

    Write-Host "siteurl: $siteUrl"
    Write-Host "home:    $homeUrl"

    if (($AllowedUrls -notcontains $siteUrl) -or ($AllowedUrls -notcontains $homeUrl)) {
        throw "Entorno no permitido. siteurl y home deben estar en: $($AllowedUrls -join ', '). No se modifico WordPress."
    }

    $contactFormShortcode = Get-LocalContactFormShortcode
    $contactFormBlockMarkup = Get-LocalContactFormBlockMarkup -Shortcode $contactFormShortcode

    if ([string]::IsNullOrWhiteSpace($contactFormShortcode)) {
        Write-Host 'Formulario local de Contacto no disponible. Se aplicara un bloque honesto con WhatsApp y correo.'
    } else {
        Write-Host "Shortcode local de Contacto: $contactFormShortcode"
    }

    $plan = @()
    foreach ($page in $Pages) {
        $contentPath = Join-Path $ContentRoot $page.File
        if (-not (Test-Path $contentPath)) {
            throw "No existe el archivo de contenido requerido: $contentPath"
        }

        $contentPath = (Resolve-Path $contentPath).Path
        if (-not $contentPath.StartsWith($ContentRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
            throw "Archivo de contenido fuera de ContentRoot: $contentPath"
        }

        $pageId = Get-PageIdBySlugOrTitle -Slug $page.Slug -Title $page.Title
        $action = if ($pageId) {
            'Update'
        } elseif ($CreateMissing) {
            'Create'
        } else {
            'Missing'
        }

        $plan += [pscustomobject]@{
            Slug = $page.Slug
            Title = $page.Title
            File = $page.File
            PageId = $pageId
            Action = $action
            ContentPath = $contentPath
        }
    }

    Write-Host ''
    Write-Host 'Plan de paginas permitido:'
    $plan | Select-Object Slug, Title, File, PageId, Action | Format-Table -AutoSize

    $missingPages = @($plan | Where-Object { $_.Action -eq 'Missing' })
    if ($missingPages.Count -gt 0) {
        $missingSummary = ($missingPages | ForEach-Object { $_.Slug }) -join ', '
        if ($DryRun) {
            Write-Host ''
            Write-Host "Paginas faltantes: $missingSummary"
            Write-Host 'Ejecuta con -Apply -CreateMissing solo si quieres crear esas paginas locales permitidas.'
        } else {
            throw "Faltan paginas permitidas: $missingSummary. Usa -CreateMissing si quieres crearlas en local."
        }
    }

    if ($DryRun) {
        Write-Host ''
        Write-Host 'DRY RUN: no se modifico WordPress. Ejecuta con -Apply para aplicar cambios.'
        return
    }

    $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $backupDirectory = Join-Path $BackupRoot $timestamp
    New-Item -ItemType Directory -Force -Path $backupDirectory | Out-Null

    Write-Host ''
    Write-Host "Backup de contenido previo: $backupDirectory"

    foreach ($entry in ($plan | Where-Object { $_.Action -eq 'Update' })) {
        $backupPath = Join-Path $backupDirectory "$($entry.Slug).json"
        Backup-PageContent -Id $entry.PageId -BackupPath $backupPath
    }

    $results = @()
    foreach ($entry in $plan) {
        $resolvedContent = Resolve-LocalContentPath -ContentPath $entry.ContentPath -ContactFormBlockMarkup $contactFormBlockMarkup

        try {
        if ($entry.Action -eq 'Update') {
            Update-PageFromFile -Id $entry.PageId -Slug $entry.Slug -Title $entry.Title -ContentPath $resolvedContent.Path
            $status = Get-PageStatus -Id $entry.PageId
            $results += [pscustomobject]@{
                ID = $entry.PageId
                Slug = $entry.Slug
                Title = $entry.Title
                Action = 'Updated'
                Status = $status
            }
            continue
        }

        if ($entry.Action -eq 'Create') {
            $createdId = Create-PageFromFile -Slug $entry.Slug -Title $entry.Title -ContentPath $resolvedContent.Path
            $status = Get-PageStatus -Id $createdId
            $results += [pscustomobject]@{
                ID = $createdId
                Slug = $entry.Slug
                Title = $entry.Title
                Action = 'Created'
                Status = $status
            }
        }
        } finally {
            if ($resolvedContent.IsTemp) {
                Remove-Item -LiteralPath $resolvedContent.Path -Force -ErrorAction SilentlyContinue
            }
        }
    }

    Write-Host ''
    Write-Host 'Resumen de paginas aplicadas:'
    $results | Format-Table -AutoSize
    Write-Host ''
    Write-Host 'Aplicacion local completada. No se modificaron usuarios, plugins, uploads, core ni wp-config.php.'
} finally {
    Pop-Location
}
