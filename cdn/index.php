<?php require_once 'config.php'; $files = getFiles(); ?>
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= SITE_NAME ?></title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a1a; color: #e0e0e0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-height: 100vh; }
    .header { background: linear-gradient(135deg, #0d0d2b, #1a0a2e); border-bottom: 1px solid rgba(0,212,255,0.1); padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { font-family: 'Orbitron', sans-serif; color: #00d4ff; font-size: 1.5rem; }
    .header h1 span { color: #8b5cf6; }
    .header a { color: #00d4ff; text-decoration: none; font-size: 0.85rem; padding: 0.5rem 1rem; border: 1px solid rgba(0,212,255,0.2); border-radius: 8px; transition: 0.2s; }
    .header a:hover { background: rgba(0,212,255,0.1); }
    .container { max-width: 900px; margin: 0 auto; padding: 2rem; }
    .stats-bar { display: flex; gap: 2rem; margin-bottom: 2rem; padding: 1.2rem 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(0,212,255,0.08); border-radius: 12px; }
    .stats-bar div { font-size: 0.85rem; color: #888; }
    .stats-bar strong { color: #00d4ff; font-size: 1.1rem; display: block; margin-top: 2px; }
    .asset { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.2rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(0,212,255,0.06); border-radius: 10px; margin-bottom: 0.5rem; transition: 0.2s; text-decoration: none; color: inherit; }
    .asset:hover { background: rgba(0,212,255,0.04); border-color: rgba(0,212,255,0.15); }
    .asset-icon { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; border-radius: 10px; background: rgba(0,212,255,0.08); color: #00d4ff; flex-shrink: 0; font-size: 1.2rem; }
    .asset-info { flex: 1; min-width: 0; }
    .asset-name { font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .asset-meta { font-size: 0.75rem; color: #666; margin-top: 3px; }
    .asset-meta span { margin-right: 1rem; }
    .asset-meta i { margin-right: 3px; color: #00d4ff; }
    .asset-btn { padding: 0.5rem 1rem; border-radius: 8px; background: linear-gradient(135deg, #00d4ff, #8b5cf6); color: #fff; font-size: 0.8rem; font-weight: 700; border: none; cursor: pointer; white-space: nowrap; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0; transition: 0.2s; }
    .asset-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,212,255,0.3); }
    .empty { text-align: center; padding: 4rem 2rem; color: #555; }
    .empty i { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
    .footer { text-align: center; padding: 2rem; color: #444; font-size: 0.8rem; }
    @media (max-width: 600px) { .header { flex-direction: column; gap: 1rem; text-align: center; } .asset { flex-wrap: wrap; } .asset-btn { width: 100%; justify-content: center; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>W<span>CDN</span></h1>
    <a href="upload.php"><i class="fas fa-upload"></i> Yükle</a>
  </div>
  <div class="container">
    <div class="stats-bar">
      <div>Toplam Dosya <strong><?= count($files) ?></strong></div>
      <div>Toplam Boyut <strong><?php $total = array_sum(array_column($files, 'size')); echo formatBytes($total); ?></strong></div>
      <div>Toplam İndirme <strong><?= number_format(array_sum(array_column($files, 'downloads'))) ?></strong></div>
    </div>
    <?php if (empty($files)): ?>
      <div class="empty"><i class="fas fa-database"></i><p>Henüz dosya yüklenmemiş.</p></div>
    <?php else: ?>
      <?php foreach ($files as $f): ?>
      <a href="download.php?f=<?= urlencode($f['id']) ?>" class="asset">
        <div class="asset-icon"><i class="fas fa-file-archive"></i></div>
        <div class="asset-info">
          <div class="asset-name"><?= htmlspecialchars($f['name']) ?></div>
          <div class="asset-meta">
            <span><i class="fas fa-database"></i><?= $f['size_formatted'] ?></span>
            <span><i class="fas fa-calendar"></i><?= $f['date'] ?></span>
            <span><i class="fas fa-download"></i><?= number_format($f['downloads']) ?> indirme</span>
          </div>
        </div>
        <span class="asset-btn">İndir <i class="fas fa-arrow-down"></i></span>
      </a>
      <?php endforeach; ?>
    <?php endif; ?>
  </div>
  <div class="footer"><?= SITE_NAME ?> &copy; <?= date('Y') ?></div>
</body>
</html>
