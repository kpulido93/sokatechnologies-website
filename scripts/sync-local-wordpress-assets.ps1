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
$UploadsTarget = Join-Path $PublicHtml 'wp-content\uploads\sokatech'

if (-not (Test-Path (Join-Path $PublicHtml 'wp-load.php'))) {
    throw "No se encontro una instalacion WordPress local valida en: $PublicHtml"
}

$Assets = @(
    [ordered]@{ Source = 'assets\images\hero-sokatechnologies-operaciones-digitales.webp'; Target = 'hero-sokatechnologies-operaciones-digitales.webp' },
    [ordered]@{ Source = 'assets\images\servicio-software-a-medida-sistemas-internos.webp'; Target = 'servicio-software-a-medida-sistemas-internos.webp' },
    [ordered]@{ Source = 'assets\images\servicio-automatizaciones-flujos-integraciones.webp'; Target = 'servicio-automatizaciones-flujos-integraciones.webp' },
    [ordered]@{ Source = 'assets\images\servicio-wordpress-corporativo-web-b2b.webp'; Target = 'servicio-wordpress-corporativo-web-b2b.webp' },
    [ordered]@{ Source = 'assets\images\servicio-dashboards-reportes-metricas.webp'; Target = 'servicio-dashboards-reportes-metricas.webp' },
    [ordered]@{ Source = 'assets\images\servicio-infraestructura-cloud-on-prem.webp'; Target = 'servicio-infraestructura-cloud-on-prem.webp' },
    [ordered]@{ Source = 'assets\images\servicio-soporte-mantenimiento-monitoreo.webp'; Target = 'servicio-soporte-mantenimiento-monitoreo.webp' },
    [ordered]@{ Source = 'assets\images\casos-exito-anonimizados-transformacion-operativa.webp'; Target = 'casos-exito-anonimizados-transformacion-operativa.webp' },
    [ordered]@{ Source = 'assets\images\contacto-diagnostico-consultivo-b2b.webp'; Target = 'contacto-diagnostico-consultivo-b2b.webp' },
    [ordered]@{ Source = 'assets\images\sobre-sokatechnologies-socio-tecnologico.webp'; Target = 'sobre-sokatechnologies-socio-tecnologico.webp' },
    [ordered]@{ Source = 'assets\images\404-sokatechnologies-ruta-no-encontrada.webp'; Target = '404-sokatechnologies-ruta-no-encontrada.webp' },
    [ordered]@{ Source = 'assets\brand\og-sokatechnologies-default.webp'; Target = 'og-sokatechnologies-default.webp' }
)

if ($PSCmdlet.ShouldProcess($UploadsTarget, 'Crear carpeta local de assets SokaTechnologies')) {
    New-Item -ItemType Directory -Force -Path $UploadsTarget | Out-Null
}

$Results = @()
foreach ($asset in $Assets) {
    $sourcePath = Join-Path $RepoRoot $asset.Source
    if (-not (Test-Path $sourcePath)) {
        throw "No existe el asset requerido: $sourcePath"
    }

    $resolvedSource = (Resolve-Path $sourcePath).Path
    $targetPath = Join-Path $UploadsTarget $asset.Target

    if ($PSCmdlet.ShouldProcess($targetPath, "Copiar $($asset.Target)")) {
        Copy-Item -LiteralPath $resolvedSource -Destination $targetPath -Force
    }

    $Results += [pscustomobject]@{
        File = $asset.Target
        Source = $asset.Source
        Target = "public_html\wp-content\uploads\sokatech\$($asset.Target)"
    }
}

Write-Host 'Assets sincronizados para WordPress local:'
$Results | Format-Table -AutoSize
