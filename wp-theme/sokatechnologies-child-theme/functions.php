<?php
/**
 * SokaTechnologies child theme functions.
 */

if (!defined('ABSPATH')) {
    exit;
}

function soka_theme_setup() {
    add_theme_support('editor-styles');
    add_editor_style([
        'assets/css/corporate.css',
        'assets/css/soka-brand.css',
    ]);
}
add_action('after_setup_theme', 'soka_theme_setup');

function soka_asset_version($relative_path) {
    $path = get_stylesheet_directory() . '/' . ltrim($relative_path, '/');

    if (file_exists($path)) {
        return (string) filemtime($path);
    }

    return wp_get_theme()->get('Version');
}

function soka_enqueue_child_theme_styles() {
    wp_enqueue_style(
        'sokatechnologies-corporate',
        get_stylesheet_directory_uri() . '/assets/css/corporate.css',
        [],
        soka_asset_version('assets/css/corporate.css')
    );

    wp_enqueue_style(
        'sokatechnologies-brand',
        get_stylesheet_directory_uri() . '/assets/css/soka-brand.css',
        ['sokatechnologies-corporate'],
        soka_asset_version('assets/css/soka-brand.css')
    );
}
add_action('wp_enqueue_scripts', 'soka_enqueue_child_theme_styles');

function soka_translate_cookieadmin_frontend_strings($translation, $text, $domain) {
    if ('cookieadmin' !== $domain || is_admin()) {
        return $translation;
    }

    static $translations = [
        'We respect your privacy' => 'Respetamos tu privacidad',
        'Cookies help us improve your experience, deliver personalized content, and analyze traffic. You can choose which cookies to allow by clicking <b>Customize</b>. Click <b>Accept All</b> to consent or <b>Reject All</b> to decline non-essential cookies.' => 'Usamos cookies para funciones basicas, medicion y mejora del sitio. Puedes elegir que cookies permitir en <b>Personalizar</b>. Pulsa <b>Aceptar todo</b> para permitir cookies no esenciales o <b>Rechazar</b> para mantenerlas desactivadas.',
        'Your Privacy Matters' => 'Tu privacidad importa',
        'We use cookies to improve your browsing experience, deliver personalized content and ads, and analyze website traffic. By clicking <b>Accept All</b>, you consent to our use of cookies. You can choose to manage your preferences or opt out of the sale or sharing of your personal information.' => 'Usamos cookies para funciones basicas, medicion y mejora del sitio. Puedes aceptar las no esenciales, rechazarlas o revisar el detalle en <b>Personalizar</b>.',
        'Personalize Your Cookie Preferences' => 'Personaliza tus preferencias de cookies',
        'Customize Your Cookie Settings' => 'Personaliza la configuracion de cookies',
        'We use cookies to ensure smooth navigation and enable essential site functions. You can view detailed information about each cookie category below. <br />Cookies marked as <b>Necessary</b> are stored in your browser because they are essential for basic site functionality. <b>These cookies do not require your consent under GDPR.</b> <br />We also use third-party cookies to analyze site usage, remember your preferences, and deliver relevant content and ads. These will only be activated with your consent. You can choose to enable or disable these cookies, but please note that turning off some types may affect your browsing experience.' => 'Usamos cookies necesarias para el funcionamiento basico del sitio. <br />Las cookies marcadas como <b>Necesarias</b> permanecen activas porque son esenciales y no requieren consentimiento adicional. <br />Las demas categorias solo se activan si las aceptas. Puedes revisar cada grupo y cambiar tu decision cuando lo necesites.',
        'We use cookies to support essential site functions and help you navigate efficiently. You can find detailed information about each cookie category below. <br /><b>Necessary</b> cookies are required for core site functionality and are always enabled. These do not require your consent. <br />Other cookies, including third-party cookies, are used to analyze usage, remember preferences, and provide relevant ads and content. These cookies are only used if you choose to enable them. You can adjust your preferences at any time. Disabling certain cookies may impact your browsing experience.' => 'Usamos cookies necesarias para el funcionamiento basico del sitio. <br /><b>Necesarias</b> siempre permanecen activas. <br />Las demas categorias solo se usan si las habilitas y puedes ajustarlas en cualquier momento.',
        'Modify Cookie Preferences' => 'Cambiar preferencias de cookies',
        'Customize' => 'Personalizar',
        'Reject All' => 'Rechazar',
        'Accept All' => 'Aceptar todo',
        'Save Preferences' => 'Guardar preferencias',
        'Powered by' => 'Con tecnologia de',
        'Re-consent' => 'Revisar cookies',
        'Cookie Preferences' => 'Preferencias de cookies',
        'Always Active' => 'Siempre activas',
        'Remark' => 'Opcional',
        'None' => 'Ninguna',
        'Necessary Cookies' => 'Cookies necesarias',
        'Necessary cookies enable essential site features like secure log-ins and consent preference adjustments. They do not store personal data.' => 'Permiten funciones esenciales del sitio, como seguridad y guardar tus preferencias de consentimiento. No almacenan datos personales con fines de marketing.',
        'Functional Cookies' => 'Cookies funcionales',
        'Functional cookies support features like content sharing on social media, collecting feedback, and enabling third-party tools.' => 'Ayudan a habilitar funciones adicionales, integraciones o herramientas de terceros cuando son necesarias.',
        'Analytical Cookies' => 'Cookies analiticas',
        'Analytical cookies track visitor interactions, providing insights on metrics like visitor count, bounce rate, and traffic sources.' => 'Nos ayudan a medir uso del sitio, visitas, fuentes de trafico y rendimiento general.',
        'Advertisement Cookies' => 'Cookies publicitarias',
        'Advertisement cookies deliver personalized ads based on your previous visits and analyze the effectiveness of ad campaigns.' => 'Se usan para contenido o anuncios personalizados y para medir la efectividad de campanas cuando aplique.',
        'Unclassified Cookies' => 'Cookies sin clasificar',
        'Unclassified cookies are cookies that we are in the process of classifying, together with the providers of individual cookies.' => 'Corresponden a cookies que todavia estan pendientes de clasificacion con sus proveedores.',
    ];

    return $translations[$text] ?? $translation;
}
add_filter('gettext', 'soka_translate_cookieadmin_frontend_strings', 20, 3);

function soka_has_live_translation_plugin() {
    return defined('TRP_PLUGIN_VERSION')
        || function_exists('trp_custom_language_switcher')
        || defined('POLYLANG_VERSION')
        || function_exists('pll_the_languages')
        || defined('ICL_SITEPRESS_VERSION')
        || defined('WEGLOT_VERSION');
}

function soka_translatepress_has_secondary_language() {
    if (!defined('TRP_PLUGIN_VERSION') && !function_exists('trp_custom_language_switcher')) {
        return false;
    }

    $settings = get_option('trp_settings', []);

    if (!is_array($settings)) {
        return false;
    }

    foreach (['publish-languages', 'translation-languages'] as $setting_key) {
        if (empty($settings[$setting_key]) || !is_array($settings[$setting_key])) {
            continue;
        }

        $languages = array_values(array_unique(array_filter(array_map('strval', $settings[$setting_key]))));

        if (count($languages) > 1) {
            return true;
        }
    }

    return false;
}

function soka_has_ready_translation_plugin() {
    if (defined('TRP_PLUGIN_VERSION') || function_exists('trp_custom_language_switcher')) {
        return soka_translatepress_has_secondary_language();
    }

    return soka_has_live_translation_plugin();
}

function soka_add_translation_state_body_class($classes) {
    if (!soka_has_ready_translation_plugin()) {
        $classes[] = 'soka-no-live-translation';
    }

    return $classes;
}
add_filter('body_class', 'soka_add_translation_state_body_class');

function soka_get_theme_icon_assets() {
    $icon_assets = [
        'browser_icon' => [
            'path' => 'assets/icons/favicon-32x32.png',
            'mime' => 'image/png',
            'sizes' => '32x32',
        ],
        'apple_touch_icon' => [
            'path' => 'assets/icons/favicon-180x180.png',
            'mime' => 'image/png',
            'sizes' => '180x180',
        ],
        'android_icon' => [
            'path' => 'assets/icons/favicon-192x192.png',
            'mime' => 'image/png',
            'sizes' => '192x192',
        ],
        'site_icon' => [
            'path' => 'assets/icons/favicon-512x512.png',
            'mime' => 'image/png',
            'sizes' => '512x512',
        ],
        'shortcut_icon' => [
            'path' => 'assets/icons/favicon.ico',
            'mime' => 'image/x-icon',
            'sizes' => 'any',
        ],
        'legacy_png' => [
            'path' => 'assets/images/favicon-sokatechnologies.png',
            'mime' => 'image/png',
            'sizes' => '1254x1254',
        ],
        'legacy_isotipo' => [
            'path' => 'assets/images/isotipo-sokatechnologies-s-modular.webp',
            'mime' => 'image/webp',
            'sizes' => '1024x1024',
        ],
    ];

    $available_assets = [];
    foreach ($icon_assets as $asset_key => $asset) {
        $filesystem_path = get_stylesheet_directory() . '/' . $asset['path'];
        if (!file_exists($filesystem_path)) {
            continue;
        }

        $asset['filesystem_path'] = $filesystem_path;
        $asset['url'] = get_stylesheet_directory_uri() . '/' . $asset['path'];
        $available_assets[$asset_key] = $asset;
    }

    return $available_assets;
}

function soka_get_theme_icon_candidate() {
    $icon_assets = soka_get_theme_icon_assets();
    $candidate_priority = [
        'site_icon',
        'apple_touch_icon',
        'browser_icon',
        'legacy_png',
        'legacy_isotipo',
    ];

    foreach ($candidate_priority as $asset_key) {
        if (!empty($icon_assets[$asset_key])) {
            return $icon_assets[$asset_key];
        }
    }

    return null;
}

function soka_output_icon_link_tag($rel, $asset, $include_sizes = true) {
    if (empty($asset['url']) || empty($asset['mime'])) {
        return;
    }

    $sizes_attribute = '';
    if ($include_sizes && !empty($asset['sizes'])) {
        $sizes_attribute = ' sizes="' . esc_attr($asset['sizes']) . '"';
    }

    echo '<link rel="' . esc_attr($rel) . '" href="' . esc_url($asset['url']) . '" type="' . esc_attr($asset['mime']) . '"' . $sizes_attribute . '>' . "\n";
}
function soka_get_schema_logo_object($organization_name) {
    $logo_object = [
        '@type' => 'ImageObject',
        '@id' => esc_url(trailingslashit(get_site_url()) . '#logo'),
        'inLanguage' => esc_html(get_bloginfo('language')),
    ];

    $site_icon_id = (int) get_option('site_icon');
    if ($site_icon_id > 0) {
        $site_icon_url = wp_get_attachment_image_url($site_icon_id, 'full');
        if ($site_icon_url) {
            $logo_object['url'] = esc_url($site_icon_url);
            $logo_object['contentUrl'] = esc_url($site_icon_url);
            $logo_object['caption'] = esc_html($organization_name);
        }

        $metadata = wp_get_attachment_metadata($site_icon_id);
        if (is_array($metadata)) {
            if (!empty($metadata['width'])) {
                $logo_object['width'] = (int) $metadata['width'];
            }

            if (!empty($metadata['height'])) {
                $logo_object['height'] = (int) $metadata['height'];
            }
        }
    } else {
        $candidate = soka_get_theme_icon_candidate();
        if ($candidate) {
            $logo_object['url'] = esc_url($candidate['url']);
            $logo_object['contentUrl'] = esc_url($candidate['url']);
            $logo_object['caption'] = esc_html($organization_name);
        }
    }

    if (empty($logo_object['url'])) {
        return null;
    }

    return $logo_object;
}

function soka_get_clean_same_as_links($social_settings) {
    if (!is_array($social_settings)) {
        return [];
    }

    $same_as = [];

    foreach ([
        'social_accounts_facebook',
        'social_accounts_instagram',
        'social_accounts_youtube',
        'social_accounts_pinterest',
    ] as $social_key) {
        if (empty($social_settings[$social_key])) {
            continue;
        }

        $same_as[] = esc_url_raw($social_settings[$social_key]);
    }

    $twitter_account = '';
    if (!empty($social_settings['social_accounts_twitter'])) {
        $twitter_account = ltrim(trim((string) $social_settings['social_accounts_twitter']), '@');
    }

    if ($twitter_account !== '') {
        $same_as[] = esc_url_raw('https://x.com/' . rawurlencode($twitter_account));
    }

    if (!empty($social_settings['social_accounts_additional']) && is_array($social_settings['social_accounts_additional'])) {
        foreach ($social_settings['social_accounts_additional'] as $additional_account) {
            if (empty($additional_account)) {
                continue;
            }

            $same_as[] = esc_url_raw($additional_account);
        }
    }

    return array_values(array_unique(array_filter($same_as)));
}

function soka_override_siteseo_social_graph() {
    if (!class_exists('\SiteSEO\SocialMetas')) {
        return;
    }

    remove_action('wp_head', '\SiteSEO\SocialMetas::add_social_graph', 1);
    add_action('wp_head', 'soka_output_clean_organization_schema', 1);
}
add_action('after_setup_theme', 'soka_override_siteseo_social_graph', 20);

function soka_output_clean_organization_schema() {
    if (is_admin()) {
        return;
    }

    global $siteseo;

    if (!isset($siteseo) || empty($siteseo->setting_enabled['toggle-social'])) {
        return;
    }

    $social_settings = is_array($siteseo->social_settings ?? null) ? $siteseo->social_settings : [];

    $organization_type = !empty($social_settings['social_knowledge_type']) && $social_settings['social_knowledge_type'] !== 'none'
        ? sanitize_text_field($social_settings['social_knowledge_type'])
        : 'Organization';
    $organization_name = !empty($social_settings['social_knowledge_name'])
        ? sanitize_text_field($social_settings['social_knowledge_name'])
        : get_bloginfo('name');
    $site_url = get_site_url();
    $site_description = get_bloginfo('description');
    if ($site_description === '') {
        $site_description = get_bloginfo('name');
    }

    $json_ld = [
        '@context' => 'https://schema.org',
        '@type' => $organization_type,
        '@id' => esc_url(trailingslashit($site_url) . '#' . $organization_type),
        'name' => esc_html($organization_name),
        'url' => esc_url($site_url),
        'description' => esc_html($site_description),
    ];

    $logo_object = soka_get_schema_logo_object($organization_name);
    if ($logo_object !== null) {
        $json_ld['logo'] = $logo_object;
    }

    $same_as = soka_get_clean_same_as_links($social_settings);
    if (!empty($same_as)) {
        $json_ld['sameAs'] = $same_as;
    }

    echo '<script type="application/ld+json">';
    echo wp_json_encode($json_ld, JSON_UNESCAPED_SLASHES);
    echo '</script>';
}

function soka_output_temporary_site_icon() {
    if (is_admin() || has_site_icon()) {
        return;
    }

    $icon_assets = soka_get_theme_icon_assets();
    $selected_icon = soka_get_theme_icon_candidate();

    if (empty($icon_assets) && $selected_icon === null) {
        return;
    }

    echo "\n";

    if (!empty($icon_assets['browser_icon'])) {
        soka_output_icon_link_tag('icon', $icon_assets['browser_icon']);
    } elseif ($selected_icon !== null) {
        soka_output_icon_link_tag('icon', $selected_icon);
    }

    if (!empty($icon_assets['android_icon'])) {
        soka_output_icon_link_tag('icon', $icon_assets['android_icon']);
    }

    if (!empty($icon_assets['shortcut_icon'])) {
        soka_output_icon_link_tag('shortcut icon', $icon_assets['shortcut_icon'], false);
    } elseif ($selected_icon !== null) {
        soka_output_icon_link_tag('shortcut icon', $selected_icon, false);
    }

    if (!empty($icon_assets['apple_touch_icon'])) {
        soka_output_icon_link_tag('apple-touch-icon', $icon_assets['apple_touch_icon']);
    } elseif ($selected_icon !== null) {
        soka_output_icon_link_tag('apple-touch-icon', $selected_icon);
    }
}
add_action('wp_head', 'soka_output_temporary_site_icon', 5);

function soka_output_open_graph_image() {
    if (is_admin()) {
        return;
    }

    $filename = 'og-sokatechnologies-default.webp';
    $relative_path = 'uploads/sokatech/' . $filename;
    $filesystem_path = WP_CONTENT_DIR . '/' . $relative_path;

    if (!file_exists($filesystem_path)) {
        return;
    }

    $image_url = content_url($relative_path);
    $alt_text = 'SokaTechnologies - software, automatizacion e infraestructura B2B';

    echo "\n" . '<meta property="og:image" content="' . esc_url($image_url) . '">' . "\n";
    echo '<meta property="og:image:alt" content="' . esc_attr($alt_text) . '">' . "\n";
    echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
    echo '<meta name="twitter:image" content="' . esc_url($image_url) . '">' . "\n";
}
add_action('wp_head', 'soka_output_open_graph_image', 20);

function soka_exclude_default_sample_page($excluded_page_ids) {
    $sample_page = get_page_by_path('sample-page');

    if ($sample_page instanceof WP_Post) {
        $excluded_page_ids[] = (int) $sample_page->ID;
    }

    return array_values(array_unique(array_map('intval', $excluded_page_ids)));
}
add_filter('wp_list_pages_excludes', 'soka_exclude_default_sample_page');

function soka_exclude_default_sample_page_from_page_list_args($args) {
    $sample_page = get_page_by_path('sample-page');

    if (!$sample_page instanceof WP_Post) {
        return $args;
    }

    $excluded_page_ids = [];

    if (!empty($args['exclude'])) {
        $excluded_page_ids = array_filter(array_map('intval', explode(',', (string) $args['exclude'])));
    }

    $excluded_page_ids[] = (int) $sample_page->ID;
    $args['exclude'] = implode(',', array_values(array_unique($excluded_page_ids)));

    return $args;
}
add_filter('wp_list_pages_args', 'soka_exclude_default_sample_page_from_page_list_args');

function soka_remove_default_sample_page_from_page_list_block($block_content) {
    if (strpos($block_content, 'sample-page') === false) {
        return $block_content;
    }

    return preg_replace(
        '#<li\b[^>]*>\s*<a\b(?=[^>]*href=["\'][^"\']*/sample-page/?["\'])[^>]*>.*?</a>\s*</li>#is',
        '',
        $block_content
    );
}
add_filter('render_block_core/page-list', 'soka_remove_default_sample_page_from_page_list_block');
