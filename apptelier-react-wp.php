<?php
/**
 * Plugin Name: Apptelier React WP
 * Description: Embed the Apptelier React frontend via shortcode [apptelier_app].
 * Version: 1.1.0
 */

if (!defined('ABSPATH')) exit;

define('APPTELIER_REACTWP_HANDLE', 'apptelier-reactwp');

function apptelier_reactwp_manifest_path() {
    return plugin_dir_path(__FILE__) . 'frontend/build/asset-manifest.json';
}

function apptelier_reactwp_read_manifest() {
    static $manifest = null;
    if ($manifest !== null) return $manifest;

    $path = apptelier_reactwp_manifest_path();
    if (!file_exists($path)) { $manifest = false; return $manifest; }

    $raw = file_get_contents($path);
    $data = json_decode($raw, true);

    $manifest = is_array($data) ? $data : false;
    return $manifest;
}

/**
 * Enqueue CRA build assets (CSS + JS entrypoints).
 * Important: called from shortcode render so it works with Elementor and builders
 * (no reliance on post_content detection).
 */
function apptelier_reactwp_enqueue_assets() {
    $manifest = apptelier_reactwp_read_manifest();
    if (!$manifest) return false;

    $entrypoints = [];
    if (isset($manifest['entrypoints']) && is_array($manifest['entrypoints'])) {
        $entrypoints = $manifest['entrypoints'];
    } elseif (isset($manifest['files']) && is_array($manifest['files'])) {
        if (!empty($manifest['files']['main.css'])) $entrypoints[] = $manifest['files']['main.css'];
        if (!empty($manifest['files']['main.js']))  $entrypoints[] = $manifest['files']['main.js'];
    }

    if (empty($entrypoints)) return false;

    $base_url = plugins_url('frontend/build/', __FILE__);
    $base_dir = plugin_dir_path(__FILE__) . 'frontend/build/';

    // Enqueue CSS first
    foreach ($entrypoints as $rel) {
        $rel = ltrim($rel, '/');
        if (substr($rel, -4) !== '.css') continue;
        $abs = $base_dir . $rel;
        $ver = file_exists($abs) ? filemtime($abs) : null;
        wp_enqueue_style(APPTELIER_REACTWP_HANDLE . '-css-' . md5($rel), $base_url . $rel, [], $ver);
    }

    // Enqueue JS in order (runtime -> vendors -> main)
    $last_js = null;
    foreach ($entrypoints as $rel) {
        $rel = ltrim($rel, '/');
        if (substr($rel, -3) !== '.js') continue;
        $abs = $base_dir . $rel;
        $ver = file_exists($abs) ? filemtime($abs) : null;
        $handle = APPTELIER_REACTWP_HANDLE . '-js-' . md5($rel);
        wp_enqueue_script($handle, $base_url . $rel, [], $ver, true);
        $last_js = $handle;
    }

    // Runtime config passed to React (read via window.ApptelierConfig)
    if ($last_js) {
        $cfg = [
            'siteUrl'    => site_url('/'),
            'restUrl'    => esc_url_raw(rest_url()),
            'nonce'      => wp_create_nonce('wp_rest'),
            // Use WP site as default API base. If you later add WP REST endpoints,
            // your frontend can call `${apiBaseUrl}/wp-json/...` or you can proxy /api/*
            'apiBaseUrl' => site_url(''),
            // Default logo URL (can be overridden in React via window.ApptelierConfig.logoUrl)
            'logoUrl'    => 'https://apptelier.sg/wp-content/uploads/2026/01/Logo_new.png',
        ];
        wp_add_inline_script($last_js, 'window.ApptelierConfig = ' . wp_json_encode($cfg) . ';', 'before');
    }

    return true;
}

function apptelier_reactwp_shortcode($atts = [], $content = null) {
    $ok = apptelier_reactwp_enqueue_assets();
    if (!$ok) {
        return '<div style="padding:12px;border:2px solid #D9534F;border-radius:10px;">
            <b>Apptelier React:</b> build not found.<br>
            Missing: <code>frontend/build/asset-manifest.json</code><br>
            Run: <code>cd wp-content/plugins/apptelier-react-wp/frontend && npm install && npm run build</code>
        </div>';
    }
    return '<div id="apptelier-app" style="min-height:60vh;"></div>';
}
add_shortcode('apptelier_app', 'apptelier_reactwp_shortcode');
