[CmdletBinding(SupportsShouldProcess = $true)]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$ScriptDirectory = if ($PSScriptRoot) {
    $PSScriptRoot
} else {
    Split-Path -Parent $MyInvocation.MyCommand.Path
}

$RepoRoot = (Resolve-Path (Join-Path $ScriptDirectory '..')).Path
$PublicHtml = Join-Path $RepoRoot 'public_html'

if (-not (Test-Path (Join-Path $PublicHtml 'wp-load.php'))) {
    throw "No se encontro una instalacion WordPress local valida en: $PublicHtml"
}

$WpCommand = (Get-Command wp -ErrorAction Stop).Source

if (-not (Test-Path (Join-Path $RepoRoot '.tmp'))) {
    New-Item -ItemType Directory -Path (Join-Path $RepoRoot '.tmp') | Out-Null
}

$TempPhpFile = Join-Path $RepoRoot '.tmp\configure-cookie-banner.php'

$CookieAdminConfig = @'
<?php
$law = 'cookieadmin_gdpr';

update_option('cookieadmin_law', $law);

$settings = get_option('cookieadmin_settings', []);
if (!is_array($settings)) {
    $settings = [];
}

$settings['block_scripts'] = true;
update_option('cookieadmin_settings', $settings);

$policy = get_option('cookieadmin_consent_settings', []);
if (!is_array($policy)) {
    $policy = [];
}

$current = [];
if (!empty($policy[$law]) && is_array($policy[$law])) {
    $current = $policy[$law];
}

$policy[$law] = array_merge(
    $current,
    [
        'cookieadmin_layout' => 'box',
        'cookieadmin_modal' => 'center',
        'cookieadmin_position' => 'bottom_right',
        'cookieadmin_days' => '365',
        'cookieadmin_notice_title' => 'Respetamos tu privacidad',
        'cookieadmin_notice' => 'Usamos cookies para funciones basicas, medicion y mejora del sitio. Puedes elegir que cookies permitir en <b>Personalizar</b>. Pulsa <b>Aceptar todo</b> para permitir cookies no esenciales o <b>Rechazar</b> para mantenerlas desactivadas.',
        'cookieadmin_preference_title' => 'Personaliza tus preferencias de cookies',
        'cookieadmin_preference' => 'Usamos cookies necesarias para el funcionamiento basico del sitio. Las demas categorias solo se activan si las aceptas. Puedes revisar cada grupo y cambiar tu decision cuando lo necesites.',
        'reConsent_title' => 'Cambiar preferencias de cookies',
        'cookieadmin_customize_btn' => 'Personalizar',
        'cookieadmin_reject_btn' => 'Rechazar',
        'cookieadmin_accept_btn' => 'Aceptar todo',
        'cookieadmin_save_btn' => 'Guardar preferencias'
    ]
);

update_option('cookieadmin_consent_settings', $policy);

echo wp_json_encode(
    [
        'law' => $law,
        'layout' => $policy[$law]['cookieadmin_layout'],
        'position' => $policy[$law]['cookieadmin_position'],
        'modal' => $policy[$law]['cookieadmin_modal'],
        'title' => $policy[$law]['cookieadmin_notice_title'],
        'accept' => $policy[$law]['cookieadmin_accept_btn'],
        'reject' => $policy[$law]['cookieadmin_reject_btn'],
        'customize' => $policy[$law]['cookieadmin_customize_btn']
    ],
    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
);
'@

if ($PSCmdlet.ShouldProcess($PublicHtml, 'Aplicar configuracion local del banner de cookies con WP-CLI')) {
    Set-Content -LiteralPath $TempPhpFile -Value $CookieAdminConfig -Encoding UTF8

    try {
        & $WpCommand "--path=$PublicHtml" eval-file $TempPhpFile
    } finally {
        if (Test-Path $TempPhpFile) {
            Remove-Item -LiteralPath $TempPhpFile -Force
        }
    }
}
