<?php
require_once 'config.php';

$file = isset($_GET['f']) ? basename($_GET['f']) : '';
$path = FILES_DIR . '/' . $file;

if (!$file || !file_exists($path)) {
    http_response_code(404);
    exit('Dosya bulunamadı.');
}

trackDownload($file);

header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $file . '"');
header('Content-Length: ' . filesize($path));
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: no-cache');

readfile($path);
exit;
