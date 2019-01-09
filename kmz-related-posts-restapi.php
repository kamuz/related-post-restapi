<?php
/*
Plugin Name: KMZ Related Posts REST
Description: Display links to related posts through the WP REST API
Version: 0.1
Author: Vladimir Kamuz
Author URI: https://wpdev.pp.ua
Plugin URI: https://wpdev.pp.ua/kmzrelrest
Licence: GPL2
Text Domain: kmzrelrest
*/

/**
 * Load CSS and JavaScript files
 */
function kmzrelrest_css_js() {
    if( is_single() && is_main_query() ) {
        // Get plugin styles
        wp_enqueue_style( 'kmzrelres_main_css', plugin_dir_url(__FILE__) . 'css/style.css', '0.1', 'all' );
    }
}
add_action( 'wp_enqueue_scripts', 'kmzrelrest_css_js' );