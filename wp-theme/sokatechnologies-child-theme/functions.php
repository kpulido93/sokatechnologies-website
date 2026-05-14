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
