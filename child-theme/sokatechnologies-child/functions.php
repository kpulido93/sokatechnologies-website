<?php
/**
 * SokaTechnologies Child Theme functions.
 *
 * Reglas:
 * - No incluir secretos.
 * - No tocar producción desde aquí.
 * - No copiar funciones del tema padre.
 * - Mantener funciones pequeñas y documentadas.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue child theme custom styles.
 */
function soka_child_enqueue_styles() {
	wp_enqueue_style(
		'soka-child-custom',
		get_stylesheet_directory_uri() . '/assets/css/soka-custom.css',
		array(),
		wp_get_theme()->get( 'Version' )
	);
}
add_action( 'wp_enqueue_scripts', 'soka_child_enqueue_styles' );