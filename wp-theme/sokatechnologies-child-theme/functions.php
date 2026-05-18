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

function soka_get_theme_icon_candidate() {
    $icon_candidates = [
        [
            'path' => 'assets/images/favicon-sokatechnologies.png',
            'mime' => 'image/png',
            'sizes' => '1254x1254',
        ],
        [
            'path' => 'assets/images/isotipo-sokatechnologies-s-modular.webp',
            'mime' => 'image/webp',
            'sizes' => '1024x1024',
        ],
    ];

    foreach ($icon_candidates as $candidate) {
        $filesystem_path = get_stylesheet_directory() . '/' . $candidate['path'];
        if (file_exists($filesystem_path)) {
            $candidate['filesystem_path'] = $filesystem_path;
            $candidate['url'] = get_stylesheet_directory_uri() . '/' . $candidate['path'];

            return $candidate;
        }
    }

    return null;
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

    $selected_icon = soka_get_theme_icon_candidate();

    if ($selected_icon === null) {
        return;
    }

    $icon_url = $selected_icon['url'];

    echo "\n" . '<link rel="icon" href="' . esc_url($icon_url) . '" type="' . esc_attr($selected_icon['mime']) . '" sizes="' . esc_attr($selected_icon['sizes']) . '">' . "\n";
    echo '<link rel="shortcut icon" href="' . esc_url($icon_url) . '" type="' . esc_attr($selected_icon['mime']) . '">' . "\n";
    echo '<link rel="apple-touch-icon" href="' . esc_url($icon_url) . '">' . "\n";
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
