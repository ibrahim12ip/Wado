<?php
require_once 'config.php';
session_start();

$error = '';
$success = '';

// Login
if (isset($_POST['login'])) {
    if ($_POST['username'] === ADMIN_USER && $_POST['password'] === ADMIN_PASS) {
        $_SESSION['admin'] = true;
    } else {
        $error = 'Hatalı kullanıcı adı veya şifre!';
    }
}

// Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: upload.php');
    exit;
}

// Upload
if (isAdmin() && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    if ($file['error'] === UPLOAD_ERR_OK) {
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (in_array($ext, ALLOWED_EXT)) {
            $dest = FILES_DIR . '/' . basename($file['name']);
            if (file_exists($dest)) {
                $info = pathinfo($file['name']);
                $dest = FILES_DIR . '/' . $info['filename'] . '_' . time() . '.' . $info['extension'];
            }
            if (move_uploaded_file($file['tmp_name'], $dest)) {
                $success = '<i class="fas fa-check-circle"></i> ' . htmlspecialchars(basename($dest)) . ' yüklendi!';
                $directLink = SITE_URL . '/download.php?f=' . urlencode(basename($dest));
                $success .= '<br><small style="color:#888">Direkt Link: </small><code style="color:#00d4ff;font-size:0.8rem">' . htmlspecialchars($directLink) . '</code>';
            } else {
                $error = 'Dosya yüklenemedi!';
            }
        } else {
            $error = 'İzin verilmeyen dosya türü: .' . $ext;
        }
    } else {
        $error = 'Yükleme hatası: ' . $file['error'];
    }
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dosya Yükle - <?= SITE_NAME ?></title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a1a; color: #e0e0e0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { max-width: 460px; width: 100%; margin: 2rem; }
    .card-inner { background: rgba(255,255,255,0.02); border: 1px solid rgba(0,212,255,0.1); border-radius: 16px; padding: 2rem; }
    .card h1 { font-family: 'Orbitron', sans-serif; color: #00d4ff; font-size: 1.3rem; margin-bottom: 0.3rem; text-align: center; }
    .card h1 span { color: #8b5cf6; }
    .card p { color: #666; font-size: 0.85rem; text-align: center; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; font-size: 0.8rem; color: #888; margin-bottom: 0.3rem; }
    .form-group input { width: 100%; padding: 0.7rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(0,212,255,0.12); border-radius: 8px; color: #e0e0e0; font-size: 0.9rem; outline: none; transition: 0.2s; }
    .form-group input:focus { border-color: #00d4ff; }
    .form-group input[type="file"] { padding: 0.5rem; }
    .btn { width: 100%; padding: 0.8rem; background: linear-gradient(135deg, #00d4ff, #8b5cf6); color: #fff; border: none; border-radius: 10px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: 0.2s; margin-top: 0.5rem; }
    .btn:hover { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(0,212,255,0.3); }
    .btn-small { padding: 0.5rem 1rem; font-size: 0.8rem; width: auto; }
    .alert { padding: 0.8rem; border-radius: 8px; font-size: 0.85rem; margin-bottom: 1rem; }
    .alert.error { background: rgba(255,23,68,0.1); border: 1px solid rgba(255,23,68,0.2); color: #ff1744; }
    .alert.success { background: rgba(0,230,118,0.1); border: 1px solid rgba(0,230,118,0.2); color: #00e676; }
    .links { display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
    .links a { color: #00d4ff; text-decoration: none; font-size: 0.85rem; opacity: 0.7; transition: 0.2s; }
    .links a:hover { opacity: 1; }
    .drop-zone { border: 2px dashed rgba(0,212,255,0.15); border-radius: 12px; padding: 2rem; text-align: center; cursor: pointer; transition: 0.2s; margin-bottom: 1rem; }
    .drop-zone:hover, .drop-zone.dragover { border-color: #00d4ff; background: rgba(0,212,255,0.03); }
    .drop-zone i { font-size: 2rem; color: #00d4ff; margin-bottom: 0.5rem; }
    .drop-zone p { color: #666; font-size: 0.85rem; }
    .file-info { display: none; padding: 0.8rem; background: rgba(0,212,255,0.04); border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem; }
    code { word-break: break-all; }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-inner">
      <h1>W<span>CDN</span></h1>
      <p>Dosya Yükleme Paneli</p>

      <?php if ($error): ?><div class="alert error"><?= $error ?></div><?php endif; ?>
      <?php if ($success): ?><div class="alert success"><?= $success ?></div><?php endif; ?>

      <?php if (!isAdmin()): ?>
      <form method="post">
        <div class="form-group"><label>Kullanıcı Adı</label><input type="text" name="username" required></div>
        <div class="form-group"><label>Şifre</label><input type="password" name="password" required></div>
        <button type="submit" name="login" class="btn"><i class="fas fa-lock"></i> Giriş Yap</button>
      </form>
      <?php else: ?>
      <form method="post" enctype="multipart/form-data" id="uploadForm">
        <div class="drop-zone" id="dropZone">
          <i class="fas fa-cloud-upload-alt"></i>
          <p>Dosyayı sürükleyin veya tıklayın</p>
          <input type="file" name="file" id="fileInput" style="display:none" required>
        </div>
        <div class="file-info" id="fileInfo"></div>
        <button type="submit" class="btn"><i class="fas fa-upload"></i> Yükle</button>
      </form>
      <div class="links">
        <a href="index.php"><i class="fas fa-home"></i> Ana Sayfa</a>
        <a href="admin.php"><i class="fas fa-cog"></i> Yönetim</a>
        <a href="?logout=1"><i class="fas fa-sign-out-alt"></i> Çıkış</a>
      </div>
      <?php endif; ?>
    </div>
  </div>

  <script>
    var dropZone = document.getElementById('dropZone');
    var fileInput = document.getElementById('fileInput');
    var fileInfo = document.getElementById('fileInfo');

    if (dropZone) {
      dropZone.onclick = function() { fileInput.click(); };
      dropZone.ondragover = function(e) { e.preventDefault(); this.classList.add('dragover'); };
      dropZone.ondragleave = function() { this.classList.remove('dragover'); };
      dropZone.ondrop = function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
          fileInput.files = e.dataTransfer.files;
          showFileInfo(e.dataTransfer.files[0]);
        }
      };
      fileInput.onchange = function() { if (this.files.length) showFileInfo(this.files[0]); };
    }

    function showFileInfo(file) {
      var size = file.size >= 1073741824 ? (file.size / 1073741824).toFixed(1) + ' GB' :
                 file.size >= 1048576 ? (file.size / 1048576).toFixed(1) + ' MB' :
                 (file.size / 1024).toFixed(1) + ' KB';
      fileInfo.style.display = 'block';
      fileInfo.innerHTML = '<i class="fas fa-file" style="color:#00d4ff;margin-right:6px"></i> ' + file.name + ' <strong style="color:#888">(' + size + ')</strong>';
    }
  </script>
</body>
</html>
