<?php
require_once 'config.php';
session_start();

if (!isAdmin()) {
    header('Location: upload.php');
    exit;
}

// Delete file
if (isset($_GET['delete'])) {
    $file = basename($_GET['delete']);
    $path = FILES_DIR . '/' . $file;
    if (file_exists($path)) {
        unlink($path);
        $stats = getStats();
        unset($stats[$file]);
        saveStats($stats);
    }
    header('Location: admin.php');
    exit;
}

$files = getFiles();
?>
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yönetim - <?= SITE_NAME ?></title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a1a; color: #e0e0e0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-height: 100vh; }
    .header { background: linear-gradient(135deg, #0d0d2b, #1a0a2e); border-bottom: 1px solid rgba(0,212,255,0.1); padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { font-family: 'Orbitron', sans-serif; color: #00d4ff; font-size: 1.3rem; }
    .header h1 span { color: #8b5cf6; }
    .header .links a { color: #888; text-decoration: none; font-size: 0.85rem; margin-left: 1rem; transition: 0.2s; }
    .header .links a:hover { color: #00d4ff; }
    .container { max-width: 1000px; margin: 0 auto; padding: 2rem; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 0.8rem 1rem; font-size: 0.75rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(0,212,255,0.08); }
    td { padding: 0.8rem 1rem; font-size: 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.03); }
    td .name { color: #e0e0e0; font-weight: 600; }
    td .size { color: #888; }
    tr:hover td { background: rgba(0,212,255,0.02); }
    .badge { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }
    .badge.dl { background: rgba(0,212,255,0.1); color: #00d4ff; }
    .badge.ext { background: rgba(139,92,246,0.1); color: #8b5cf6; text-transform: uppercase; }
    .btn-icon { padding: 0.4rem 0.7rem; border-radius: 6px; border: none; cursor: pointer; font-size: 0.8rem; transition: 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
    .btn-icon.copy { background: rgba(0,212,255,0.1); color: #00d4ff; }
    .btn-icon.copy:hover { background: rgba(0,212,255,0.2); }
    .btn-icon.danger { background: rgba(255,23,68,0.1); color: #ff1744; }
    .btn-icon.danger:hover { background: rgba(255,23,68,0.2); }
    .copy-input { position: absolute; left: -9999px; }
    .empty { text-align: center; padding: 4rem; color: #555; }
    .empty i { font-size: 2.5rem; margin-bottom: 1rem; }
    @media (max-width: 700px) {
      table { font-size: 0.8rem; }
      th:nth-child(3), td:nth-child(3) { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>W<span>CDN</span> Yönetim</h1>
    <div class="links">
      <a href="index.php"><i class="fas fa-home"></i> Site</a>
      <a href="upload.php"><i class="fas fa-upload"></i> Yükle</a>
      <a href="?logout=1"><i class="fas fa-sign-out-alt"></i> Çıkış</a>
    </div>
  </div>
  <div class="container">
    <?php if (empty($files)): ?>
      <div class="empty"><i class="fas fa-database"></i><p>Henüz dosya yok. <a href="upload.php" style="color:#00d4ff">İlk dosyayı yükle</a></p></div>
    <?php else: ?>
    <table>
      <thead>
        <tr><th>Dosya</th><th>Boyut</th><th>Tür</th><th>İndirme</th><th>Tarih</th><th></th></tr>
      </thead>
      <tbody>
        <?php foreach ($files as $f): ?>
        <tr>
          <td><span class="name"><?= htmlspecialchars($f['name']) ?></span></td>
          <td><span class="size"><?= $f['size_formatted'] ?></span></td>
          <td><span class="badge ext"><?= $f['ext'] ?></span></td>
          <td><span class="badge dl"><?= number_format($f['downloads']) ?></span></td>
          <td style="color:#666;font-size:0.8rem"><?= $f['date'] ?></td>
          <td style="text-align:right;white-space:nowrap">
            <a href="javascript:void(0)" class="btn-icon copy" onclick="copyLink('<?= SITE_URL ?>/download.php?f=<?= urlencode($f['id']) ?>')"><i class="fas fa-link"></i> Link</a>
            <a href="?delete=<?= urlencode($f['id']) ?>" class="btn-icon danger" onclick="return confirm('Silinsin mi?')"><i class="fas fa-trash"></i></a>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
    <input class="copy-input" id="copyInput" readonly>
    <?php endif; ?>
  </div>
  <script>
    function copyLink(url) {
      var input = document.getElementById('copyInput');
      input.value = url;
      input.select();
      document.execCommand('copy');
      alert('Link kopyalandı: ' + url);
    }
  </script>
</body>
</html>
