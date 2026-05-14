<?php

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . '/public_html' . $path;

if ($path !== '/' && is_file($file)) {
    return false;
}

require __DIR__ . '/public_html/index.php';
