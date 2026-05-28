<?php
// Wado CDN - Config
define('ADMIN_USER', 'ibrahim');
define('ADMIN_PASS', 'ibrahim123');
define('SITE_NAME', 'Wado CDN');
define('SITE_URL', 'https://' . $_SERVER['HTTP_HOST']);
define('FILES_DIR', __DIR__ . '/files');
define('DATA_DIR', __DIR__ . '/data');
define('MAX_FILE_SIZE', 500 * 1024 * 1024); // 500MB
define('STATS_FILE', DATA_DIR . '/stats.json');
define('ALLOWED_EXT', ['zip', 'rar', '7z', 'gz', 'tar', 'exe', 'msi', 'iso', 'apk', 'pdf', 'png', 'jpg']);

if (!file_exists(DATA_DIR)) mkdir(DATA_DIR, 0755, true);
if (!file_exists(FILES_DIR)) mkdir(FILES_DIR, 0755, true);
if (!file_exists(STATS_FILE)) file_put_contents(STATS_FILE, '{}');

function formatBytes($bytes) {
    if ($bytes >= 1073741824) return number_format($bytes / 1073741824, 1) . ' GB';
    if ($bytes >= 1048576) return number_format($bytes / 1048576, 1) . ' MB';
    if ($bytes >= 1024) return number_format($bytes / 1024, 1) . ' KB';
    return $bytes . ' B';
}

function getStats() {
    return json_decode(file_get_contents(STATS_FILE), true) ?: [];
}

function saveStats($stats) {
    file_put_contents(STATS_FILE, json_encode($stats, JSON_PRETTY_PRINT));
}

function trackDownload($fileId) {
    $stats = getStats();
    if (!isset($stats[$fileId])) $stats[$fileId] = ['downloads' => 0, 'last_download' => null];
    $stats[$fileId]['downloads']++;
    $stats[$fileId]['last_download'] = date('Y-m-d H:i:s');
    saveStats($stats);
}

function getFiles() {
    $files = [];
    if (!is_dir(FILES_DIR)) return $files;
    $items = scandir(FILES_DIR, SCANDIR_SORT_DESCENDING);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $path = FILES_DIR . '/' . $item;
        if (is_file($path)) {
            $stats = getStats();
            $files[] = [
                'id' => $item,
                'name' => $item,
                'size' => filesize($path),
                'size_formatted' => formatBytes(filesize($path)),
                'ext' => strtolower(pathinfo($item, PATHINFO_EXTENSION)),
                'date' => date('Y-m-d H:i', filemtime($path)),
                'downloads' => $stats[$item]['downloads'] ?? 0,
                'last_download' => $stats[$item]['last_download'] ?? null,
            ];
        }
    }
    return $files;
}

function isAdmin() {
    return isset($_SESSION['admin']) && $_SESSION['admin'] === true;
}
