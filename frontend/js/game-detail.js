document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('gameDetailContainer');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const gameId = parseInt(params.get('id'));
  const game = WADO.getGame(gameId);

  if (!game) {
    container.innerHTML = `
      <div class="section" style="text-align:center;padding:5rem 2rem;">
        <i class="fas fa-gamepad" style="font-size:4rem;color:var(--neon-blue-dim);margin-bottom:1rem;"></i>
        <h1 style="font-family:Orbitron,sans-serif;">Oyun Bulunamadı</h1>
        <p style="color:var(--text-secondary);margin:1rem 0 2rem;">Aradığınız oyun veritabanımızda bulunamadı.</p>
        <a href="games.html" class="btn-primary"><i class="fas fa-arrow-left"></i> Oyunlara Dön</a>
      </div>
    `;
    return;
  }

  document.title = `${game.title} - Wado`;
  document.querySelector('meta[name="description"]').content = `${game.title} - ${game.description.slice(0, 150)}`;

  const dlInfo = WADO.getDownloadInfo(game.id);
  const isFree = dlInfo?.type === 'free';

  container.innerHTML = `
    <div class="game-detail-hero">
      <img src="${game.bg || game.image}" alt="${game.title}">
      <div class="game-detail-hero-overlay">
        <div class="game-detail-hero-content">
          <div class="hero-badges">
            <span class="hero-badge ${dlInfo?.type}">${isFree ? '<i class="fas fa-gift"></i> Ücretsiz' : '<i class="fas fa-shopping-bag"></i> Premium'}</span>
            <span class="hero-badge"><i class="fas fa-database"></i> ${dlInfo?.fileSize || '—'}</span>
            <span class="hero-badge"><i class="fas fa-cloud-download-alt"></i> ${(dlInfo?.downloads || 0).toLocaleString()} indirme</span>
          </div>
          <h1>${game.title}</h1>
          <div class="game-detail-meta">
            <span><i class="fas fa-star" style="color:#ffd600;"></i> ${game.rating}</span>
            <span><i class="fas fa-calendar"></i> ${game.releaseDate}</span>
            <span><i class="fas fa-building"></i> ${game.developer}</span>
            <span><i class="fas fa-tag"></i> ${game.category}</span>
          </div>
          <p class="hero-desc">${game.description.slice(0, 200)}...</p>
          <div class="hero-download-buttons">
            <a href="download-redirect.html?id=${game.id}" class="btn-download-hero-main">
              <i class="fas fa-download"></i>
              <span>${isFree ? 'Ücretsiz İndir' : 'Şimdi İndir'} <small>${dlInfo?.fileSize || ''}</small></span>
            </a>
            <button class="btn-download-hero-secondary" onclick="document.querySelector('.download-section').scrollIntoView({behavior:'smooth'})">
              <i class="fas fa-info-circle"></i> Detaylar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="game-detail-content">
      <div class="game-detail-grid">
        <div class="game-detail-sidebar">
          <div class="game-detail-cover">
            <img src="${game.image}" alt="${game.title}">
          </div>
          <a href="download-redirect.html?id=${game.id}" class="sidebar-download-btn glass">
            <i class="fas fa-download"></i>
            <div>
              <strong>${isFree ? 'Ücretsiz İndir' : 'Oyunu İndir'}</strong>
              <small>${dlInfo?.fileSize || ''} • ${isFree ? 'Ücretsiz' : 'Premium'}</small>
            </div>
          </a>
          <div class="game-detail-features" style="grid-template-columns:1fr;">
            ${game.features.map(f => `
              <div class="feature-item">
                <i class="fas fa-check-circle"></i>
                <span>${f}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="game-detail-main">
          <h1>${game.title}</h1>
          <div class="game-detail-meta">
            <span><i class="fas fa-star" style="color:#ffd600;"></i> ${game.rating}</span>
            <span><i class="fas fa-calendar"></i> ${game.releaseDate}</span>
            <span><i class="fas fa-building"></i> ${game.developer}</span>
            <span><i class="fas fa-tag"></i> ${game.category}</span>
          </div>
          <div class="game-detail-description">
            ${game.description}
          </div>

          <div class="download-section glass">
            <div class="download-section-header">
              <div>
                <h2><i class="fas fa-download"></i> ${game.title} İndir</h2>
                <p>Oyun dosyasını doğrudan Wado sunucularından indir.</p>
              </div>
              <div class="download-stats-badge">
                <i class="fas fa-cloud-download-alt"></i>
                <strong>${(dlInfo?.downloads || 0).toLocaleString()}</strong>
                <span>Toplam İndirme</span>
              </div>
            </div>
            <div class="download-info-boxes">
              <div class="download-info-box">
                <i class="fas fa-database"></i>
                <div>
                  <span>Dosya Boyutu</span>
                  <strong>${dlInfo?.fileSize || 'Bilinmiyor'}</strong>
                </div>
              </div>
              <div class="download-info-box">
                <i class="fas fa-tag"></i>
                <div>
                  <span>Tür</span>
                  <strong>${isFree ? 'Ücretsiz' : 'Premium'}</strong>
                </div>
              </div>
              <div class="download-info-box">
                <i class="fas fa-shield-alt"></i>
                <div>
                  <span>Güvenlik</span>
                  <strong>Virüssüz</strong>
                </div>
              </div>
              <div class="download-info-box">
                <i class="fas fa-server"></i>
                <div>
                  <span>Sunucu</span>
                  <strong>Wado CDN</strong>
                </div>
              </div>
            </div>
            <a href="download-redirect.html?id=${game.id}" class="btn-download-main">
              <i class="fas fa-download"></i>
              <span>${isFree ? 'Ücretsiz İndir' : 'Oyunu İndir'} <small>${dlInfo?.fileSize || ''}</small></span>
            </a>
            <div class="download-notice">
              <i class="fas fa-check-circle" style="color:#00e676;"></i>
              <span>Bu oyun Wado tarafından barındırılmaktadır. %100 güvenli indirme.</span>
            </div>
            <div class="download-parts-info">
              <i class="fas fa-info-circle"></i> İndirme işleminiz otomatik olarak başlayacaktır. Dosya boyutu büyük olduğu için indirme süresi internet hızınıza bağlıdır.
            </div>
          </div>

          <h2 style="font-family:Rajdhani,sans-serif;font-weight:700;font-size:1.4rem;margin-bottom:1rem;"><i class="fas fa-video"></i> Fragman</h2>
          <div class="game-detail-trailer">
            <iframe src="${game.trailer}" allowfullscreen></iframe>
          </div>

          <h2 style="font-family:Rajdhani,sans-serif;font-weight:700;font-size:1.4rem;margin-bottom:1rem;"><i class="fas fa-microchip"></i> Sistem Gereksinimleri</h2>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:2rem;">
            <div class="sys-req-col min" style="padding:1.2rem;background:var(--glass-bg);border-radius:10px;border:1px solid var(--glass-border);">
              <h4 style="color:#ffd600;font-family:Rajdhani,sans-serif;font-weight:700;margin-bottom:0.8rem;"><i class="fas fa-arrow-down"></i> Minimum</h4>
              <ul style="list-style:none;">
                <li style="padding:0.4rem 0;font-size:0.85rem;color:var(--text-secondary);border-bottom:1px solid var(--glass-border);"><strong style="color:var(--text-primary);">OS:</strong> ${game.sysReq.min.os}</li>
                <li style="padding:0.4rem 0;font-size:0.85rem;color:var(--text-secondary);border-bottom:1px solid var(--glass-border);"><strong style="color:var(--text-primary);">CPU:</strong> ${game.sysReq.min.cpu}</li>
                <li style="padding:0.4rem 0;font-size:0.85rem;color:var(--text-secondary);border-bottom:1px solid var(--glass-border);"><strong style="color:var(--text-primary);">RAM:</strong> ${game.sysReq.min.ram}</li>
                <li style="padding:0.4rem 0;font-size:0.85rem;color:var(--text-secondary);border-bottom:1px solid var(--glass-border);"><strong style="color:var(--text-primary);">GPU:</strong> ${game.sysReq.min.gpu}</li>
                <li style="padding:0.4rem 0;font-size:0.85rem;color:var(--text-secondary);"><strong style="color:var(--text-primary);">Depolama:</strong> ${game.sysReq.min.storage}</li>
              </ul>
            </div>
            <div class="sys-req-col rec" style="padding:1.2rem;background:var(--glass-bg);border-radius:10px;border:1px solid var(--glass-border);">
              <h4 style="color:#00e676;font-family:Rajdhani,sans-serif;font-weight:700;margin-bottom:0.8rem;"><i class="fas fa-arrow-up"></i> Önerilen</h4>
              <ul style="list-style:none;">
                <li style="padding:0.4rem 0;font-size:0.85rem;color:var(--text-secondary);border-bottom:1px solid var(--glass-border);"><strong style="color:var(--text-primary);">OS:</strong> ${game.sysReq.rec.os}</li>
                <li style="padding:0.4rem 0;font-size:0.85rem;color:var(--text-secondary);border-bottom:1px solid var(--glass-border);"><strong style="color:var(--text-primary);">CPU:</strong> ${game.sysReq.rec.cpu}</li>
                <li style="padding:0.4rem 0;font-size:0.85rem;color:var(--text-secondary);border-bottom:1px solid var(--glass-border);"><strong style="color:var(--text-primary);">RAM:</strong> ${game.sysReq.rec.ram}</li>
                <li style="padding:0.4rem 0;font-size:0.85rem;color:var(--text-secondary);border-bottom:1px solid var(--glass-border);"><strong style="color:var(--text-primary);">GPU:</strong> ${game.sysReq.rec.gpu}</li>
                <li style="padding:0.4rem 0;font-size:0.85rem;color:var(--text-secondary);"><strong style="color:var(--text-primary);">Depolama:</strong> ${game.sysReq.rec.storage}</li>
              </ul>
            </div>
          </div>

          <h2 style="font-family:Rajdhani,sans-serif;font-weight:700;font-size:1.4rem;margin-bottom:1rem;"><i class="fas fa-tags"></i> Etiketler</h2>
          <div class="game-detail-tags">
            ${game.tags.map(t => `<span class="game-tag" style="padding:0.4rem 1rem;font-size:0.85rem;">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
});
