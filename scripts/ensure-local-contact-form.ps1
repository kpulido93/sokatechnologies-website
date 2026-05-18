[CmdletBinding()]
param(
    [string[]] $AllowedUrls = @('http://127.0.0.1:8088'),
    [string] $FormTitle = 'Diagnóstico comercial'
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

if (-not (Test-Path (Join-Path $PublicHtml 'wp-load.php'))) {
    throw "No se encontro una instalacion WordPress local valida en: $PublicHtml"
}

$WpCommand = Get-Command wp -ErrorAction SilentlyContinue
if (-not $WpCommand) {
    throw 'WP-CLI no esta disponible en PATH. No se puede preparar el formulario local.'
}

$script:WpExecutable = $WpCommand.Source
if ([string]::IsNullOrWhiteSpace($script:WpExecutable)) {
    $script:WpExecutable = $WpCommand.Name
}

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

function Test-WpCommandSuccess {
    param(
        [Parameter(Mandatory = $true)]
        [string[]] $Arguments
    )

    & $script:WpExecutable @Arguments *> $null
    return ($LASTEXITCODE -eq 0)
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

$php = @'
$formTitle = isset($args[0]) && $args[0] ? sanitize_text_field($args[0]) : 'Diagnóstico comercial';

$adminIds = get_users([
    'role'   => 'administrator',
    'number' => 1,
    'fields' => 'ID',
]);

if (!empty($adminIds)) {
    wp_set_current_user((int) $adminIds[0]);
}

$managedMeta = wpFluent()->table('fluentform_form_meta')
    ->where('meta_key', '_soka_local_contact_form')
    ->where('value', 'yes')
    ->orderBy('form_id', 'asc')
    ->first();

$managedFormId = 0;
$managedFormTitle = $formTitle;

if ($managedMeta) {
    $existingForm = wpFluent()->table('fluentform_forms')
        ->where('id', (int) $managedMeta->form_id)
        ->first();

    if ($existingForm) {
        $managedFormId = (int) $existingForm->id;
        $managedFormTitle = $existingForm->title;
    }
}

$defaults = fluentformLoadFile('Services/FormBuilder/DefaultElements.php');
$general = $defaults['general'];
$advanced = $defaults['advanced'];

$makeElementKey = static function () {
    return 'el_' . wp_generate_uuid4();
};

$makeRequiredRule = static function ($message) {
    return [
        'value'          => true,
        'message'        => $message,
        'global_message' => $message,
        'global'         => true,
    ];
};

$makeText = static function ($name, $label, $required, $placeholder = '') use ($general, $makeElementKey, $makeRequiredRule) {
    $field = $general['input_text'];
    $field['uniqElKey'] = $makeElementKey();
    $field['attributes']['name'] = $name;
    $field['attributes']['placeholder'] = $placeholder;
    $field['settings']['label'] = $label;
    $field['settings']['admin_field_label'] = $label;
    $field['settings']['validation_rules']['required'] = $makeRequiredRule('Este campo es obligatorio.');
    $field['settings']['validation_rules']['required']['value'] = $required;
    return $field;
};

$makeEmail = static function ($name, $label, $required, $placeholder = '') use ($general, $makeElementKey, $makeRequiredRule) {
    $field = $general['input_email'];
    $field['uniqElKey'] = $makeElementKey();
    $field['attributes']['name'] = $name;
    $field['attributes']['placeholder'] = $placeholder;
    $field['settings']['label'] = $label;
    $field['settings']['admin_field_label'] = $label;
    $field['settings']['validation_rules']['required'] = $makeRequiredRule('Este campo es obligatorio.');
    $field['settings']['validation_rules']['required']['value'] = $required;
    $field['settings']['validation_rules']['email']['message'] = 'Ingresa un correo válido.';
    $field['settings']['validation_rules']['email']['global_message'] = 'Ingresa un correo válido.';
    return $field;
};

$makeTextarea = static function ($name, $label, $required, $placeholder = '', $rows = 4) use ($general, $makeElementKey, $makeRequiredRule) {
    $field = $general['textarea'];
    $field['uniqElKey'] = $makeElementKey();
    $field['attributes']['name'] = $name;
    $field['attributes']['placeholder'] = $placeholder;
    $field['attributes']['rows'] = $rows;
    $field['settings']['label'] = $label;
    $field['settings']['admin_field_label'] = $label;
    $field['settings']['validation_rules']['required'] = $makeRequiredRule('Este campo es obligatorio.');
    $field['settings']['validation_rules']['required']['value'] = $required;
    return $field;
};

$makeSelect = static function ($name, $label, $required, $placeholder, array $options) use ($general, $makeElementKey, $makeRequiredRule) {
    $field = $general['select'];
    $field['uniqElKey'] = $makeElementKey();
    $field['attributes']['name'] = $name;
    $field['settings']['label'] = $label;
    $field['settings']['admin_field_label'] = $label;
    $field['settings']['placeholder'] = $placeholder;
    $field['settings']['advanced_options'] = [];
    foreach ($options as $option) {
        $field['settings']['advanced_options'][] = [
            'label'      => $option,
            'value'      => $option,
            'calc_value' => '',
        ];
    }
    $field['settings']['validation_rules']['required'] = $makeRequiredRule('Este campo es obligatorio.');
    $field['settings']['validation_rules']['required']['value'] = $required;
    return $field;
};

$fields = [
    $makeText('nombre', 'Nombre', true, 'Nombre y apellido'),
    $makeText('empresa', 'Empresa', true, 'Nombre de la empresa'),
    $makeEmail('correo_comercial', 'Correo comercial', true, 'nombre@empresa.com'),
    $makeText('whatsapp', 'WhatsApp', false, '+57 300 000 0000'),
    $makeText('pais', 'País', true, 'País donde opera la empresa'),
    $makeSelect(
        'servicio_de_interes',
        'Servicio de interés',
        true,
        'Selecciona una opción',
        [
            'Software a medida',
            'Automatizaciones e integraciones',
            'Sitio web WordPress corporativo',
            'Dashboards y reportes',
            'Infraestructura cloud/on-prem',
            'Soporte y mantenimiento',
            'Diagnóstico inicial',
            'No estoy seguro todavía',
        ]
    ),
    $makeTextarea(
        'contexto_general_del_caso',
        'Contexto general del caso',
        true,
        'Describe el proceso, sistema o infraestructura que quieres revisar.',
        5
    ),
    $makeTextarea(
        'herramientas_actuales',
        'Herramientas actuales',
        false,
        'Sistemas, hojas, sitio web, hosting, CRM, ERP u otras herramientas usadas hoy.',
        4
    ),
    $makeTextarea(
        'resultado_esperado',
        'Resultado esperado',
        false,
        'Qué quieres reducir, automatizar, medir, ordenar o mantener con mayor control.',
        4
    ),
    $makeSelect(
        'urgencia',
        'Urgencia',
        false,
        'Selecciona una opción',
        [
            'Sin urgencia inmediata',
            'Este mes',
            'En dos semanas',
            'Urgente',
        ]
    ),
];

$privacyAgreement = $advanced['terms_and_condition'];
$privacyAgreement['uniqElKey'] = $makeElementKey();
$privacyAgreement['settings']['tnc_html'] = 'He leído y acepto la nota de privacidad y confidencialidad para este primer contacto.';
$privacyAgreement['settings']['admin_field_label'] = 'Privacidad y confidencialidad';
$privacyAgreement['settings']['validation_rules']['required'] = $makeRequiredRule('Debes aceptar esta condición para enviar el formulario.');
$fields[] = $privacyAgreement;

$formFields = [
    'fields'       => $fields,
    'submitButton' => [
        'uniqElKey' => $makeElementKey(),
        'element'   => 'button',
        'attributes' => [
            'type'  => 'submit',
            'class' => '',
        ],
        'settings' => [
            'align'            => 'left',
            'button_style'     => 'default',
            'container_class'  => '',
            'help_message'     => '',
            'background_color' => '#1a7efb',
            'button_size'      => 'md',
            'color'            => '#ffffff',
            'button_ui'        => [
                'type'    => 'default',
                'text'    => 'Enviar diagnóstico',
                'img_url' => '',
            ],
        ],
        'editor_options' => [
            'title' => 'Submit Button',
        ],
    ],
];

$defaultSettings = [
    'confirmation' => [
        'redirectTo'            => 'samePage',
        'messageToShow'         => 'Gracias por contactar a SokaTechnologies. Revisaremos tu caso y te responderemos en horario de atención.',
        'customPage'            => null,
        'samePageFormBehavior'  => 'hide_form',
        'customUrl'             => null,
    ],
    'restrictions' => [
        'limitNumberOfEntries' => [
            'enabled'         => false,
            'numberOfEntries' => null,
            'period'          => 'total',
            'limitReachedMsg' => 'Maximum number of entries exceeded.',
        ],
        'scheduleForm' => [
            'enabled'     => false,
            'start'       => null,
            'end'         => null,
            'selectedDays' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            'pendingMsg'  => 'Form submission is not started yet.',
            'expiredMsg'  => 'Form submission is now closed.',
        ],
        'requireLogin' => [
            'enabled'         => false,
            'requireLoginMsg' => 'You must be logged in to submit the form.',
        ],
        'denyEmptySubmission' => [
            'enabled' => false,
            'message' => 'Sorry, you cannot submit an empty form.',
        ],
    ],
    'layout' => [
        'labelPlacement'       => 'top',
        'helpMessagePlacement' => 'with_label',
        'errorMessagePlacement' => 'inline',
        'cssClassName'         => '',
        'asteriskPlacement'    => 'asterisk-right',
    ],
    'delete_entry_on_submission' => 'no',
    'appendSurveyResult' => [
        'enabled'   => false,
        'showLabel' => false,
        'showCount' => false,
    ],
];

$defaultNotifications = [
    'name' => 'Notificacion interna SokaTechnologies',
    'sendTo' => [
        'type'    => 'email',
        'email'   => 'info@sokatechnologies.com',
        'field'   => null,
        'routing' => [
            [
                'email'    => null,
                'field'    => null,
                'operator' => '=',
                'value'    => null,
            ],
        ],
    ],
    'fromName' => 'SokaTechnologies Web',
    'fromEmail' => '',
    'replyTo' => '{inputs.correo_comercial}',
    'bcc' => '',
    'subject' => 'Nuevo contacto web - {inputs.servicio_de_interes} - {inputs.empresa}',
    'message' => "<p>{all_data}</p>\n<p>Origen: {embed_post.permalink}</p>",
    'conditionals' => [
        'status' => false,
        'type'   => 'all',
        'conditions' => [
            [
                'field'    => null,
                'operator' => '=',
                'value'    => null,
            ],
        ],
    ],
    'enabled' => true,
    'email_template' => '',
];

$formFieldsJson = wp_json_encode($formFields);
$managedFormTitle = $formTitle . ' (#' . $managedFormId . ')';

if ($managedFormId > 0) {
    $formModule = new \FluentForm\App\Modules\Form\Form(wpFluentForm());
    $formModule->updateMeta($managedFormId, 'formSettings', $defaultSettings);
    $formModule->updateMeta($managedFormId, 'notifications', $defaultNotifications);
    $formModule->updateMeta($managedFormId, '_soka_local_contact_form', 'yes');
    $formModule->updateMeta($managedFormId, '_primary_email_field', 'correo_comercial');
    $formModule->updateMeta($managedFormId, 'template_name', 'soka_diagnostico_comercial');
    wpFluent()->table('fluentform_forms')
        ->where('id', $managedFormId)
        ->update([
            'title'       => $managedFormTitle,
            'form_fields' => $formFieldsJson,
            'updated_at'  => current_time('mysql'),
        ]);

    echo wp_json_encode([
        'status'    => 'existing',
        'title'     => $managedFormTitle,
        'formId'    => $managedFormId,
        'shortcode' => sprintf('[fluentform id="%d"]', $managedFormId),
    ]);
    return;
}

wpFluentForm('request')->merge([
    'title'  => $formTitle,
    'status' => 'published',
    'type'   => 'form',
]);

$formModule = new \FluentForm\App\Modules\Form\Form(wpFluentForm());
$reflection = new ReflectionClass($formModule);

foreach ([
    'formFields'           => $formFieldsJson,
    'defaultSettings'      => $defaultSettings,
    'defaultNotifications' => $defaultNotifications,
] as $propertyName => $propertyValue) {
    $property = $reflection->getProperty($propertyName);
    $property->setAccessible(true);
    $property->setValue($formModule, $propertyValue);
}

$result = $formModule->store(false);
$formId = (int) $result['formId'];

$formModule->updateMeta($formId, '_soka_local_contact_form', 'yes');
$formModule->updateMeta($formId, '_primary_email_field', 'correo_comercial');
$formModule->updateMeta($formId, 'template_name', 'soka_diagnostico_comercial');

echo wp_json_encode([
    'status'    => 'created',
    'title'     => $formTitle . ' (#' . $formId . ')',
    'formId'    => $formId,
    'shortcode' => sprintf('[fluentform id="%d"]', $formId),
]);
'@

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

    if (-not (Test-WpCommandSuccess @('plugin', 'is-installed', 'fluentform'))) {
        Write-Host ''
        Write-Host 'Fluent Forms Lite no estaba instalado. Instalando y activando en local...'
        Invoke-WpText @('plugin', 'install', 'fluentform', '--activate') | Out-Null
    } elseif (-not (Test-WpCommandSuccess @('plugin', 'is-active', 'fluentform'))) {
        Write-Host ''
        Write-Host 'Fluent Forms Lite estaba instalado pero inactivo. Activando en local...'
        Invoke-WpText @('plugin', 'activate', 'fluentform') | Out-Null
    }

    $resultJson = Invoke-WpEvalFileText -Php $php -Name 'ensure-local-contact-form' -Arguments @($FormTitle)
    if ([string]::IsNullOrWhiteSpace($resultJson)) {
        throw 'No se recibio respuesta al crear o recuperar el formulario local.'
    }

    $result = $resultJson | ConvertFrom-Json

    Write-Host ''
    Write-Host "Formulario: $($result.title)"
    Write-Host "Estado:     $($result.status)"
    Write-Host "ID:         $($result.formId)"
    Write-Host "Shortcode:  $($result.shortcode)"
    Write-Host ''
    Write-Host 'Formulario local listo. No se tocaron produccion, core, wp-admin, wp-includes ni wp-config.php.'
} finally {
    Pop-Location
}
