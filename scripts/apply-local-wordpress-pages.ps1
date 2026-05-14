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
        [string] $Title,

        [Parameter(Mandatory = $true)]
        [string] $ContentPath
    )

    $php = @'
$id = (int) $args[0];
$path = $args[1];
$title = $args[2];

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

    Invoke-WpEvalFileText -Php $php -Name 'update-page' -Arguments @("$Id", $ContentPath, $Title) | Out-Null
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
        if ($entry.Action -eq 'Update') {
            Update-PageFromFile -Id $entry.PageId -Title $entry.Title -ContentPath $entry.ContentPath
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
            $createdId = Create-PageFromFile -Slug $entry.Slug -Title $entry.Title -ContentPath $entry.ContentPath
            $status = Get-PageStatus -Id $createdId
            $results += [pscustomobject]@{
                ID = $createdId
                Slug = $entry.Slug
                Title = $entry.Title
                Action = 'Created'
                Status = $status
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
