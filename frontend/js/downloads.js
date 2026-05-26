document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('downloadsContainer');
  if (!container) return;

  const categoryFilter = document.getElementById('downloadCategoryFilter');
  const typeFilter = document.getElementById('downloadTypeFilter');
  const sortFilter = document.getElementById('downloadSortFilter');
  const searchInput = document.getElementById('downloadSearchInput');
  const loadMoreBtn = document.getElementById('loadMoreDownloads');

  let currentCategory = 'all', currentType = 'all', currentSort = 'popular', currentQuery = '';
  let visibleCount = 12;

  function filterDownloads() {
    let items = WADO.games.map(g => ({ ...g, ...(WADO.downloads[g.id] || {}) }));

    if (currentCategory !== 'all') items = items.filter(g => g.category === currentCategory);
    if (currentType !== 'all') items = items.filter(g => g.type === currentType);
    if (currentQuery) {
      const q = currentQuery.toLowerCase();
      items = items.filter(g => g.title.toLowerCase().includes(q) || g.tags.some(t => t.toLowerCase().includes(q)));
    }

    switch (currentSort) {
      case 'popular': items.sort((a, b) => (b.downloads || 0) - (a.downloads || 0)); break;
      case 'newest': items.sort((a, b) => b.year - a.year || b.id - a.id); break;
      case 'size': items.sort((a, b) => {
        const sizeA = parseInt((a.fileSize || '0').replace(/[^0-9]/g, ''));
        const sizeB = parseInt((b.fileSize || '0').replace(/[^0-9]/g, ''));
        return sizeB - sizeA;
      }); break;
      case 'name': items.sort((a, b) => a.title.localeCompare(b.title)); break;
    }

    return items;
  }

  function render() {
    const filtered = filterDownloads();
    const toShow = filtered.slice(0, visibleCount);

    container.innerHTML = toShow.length ? toShow.map(game => {
      const isFree = game.type === 'free';
      return `
        <div class="download-card glass">
          <div class="download-card-left">
            <img src="${game.image}" alt="${game.title}" loading="lazy">
            <div class="download-card-info">
              <div class="dci-header">
                <h3>${game.title}</h3>
                <span class="dl-type-badge ${isFree ? 'free' : 'paid'}">
                  ${isFree ? '<i class="fas fa-gift"></i> Ücretsiz' : '<i class="fas fa-crown"></i> Premium'}
                </span>
              </div>
              <div class="download-card-meta">
                <span><i class="fas fa-tag"></i> ${game.category}</span>
                <span><i class="fas fa-star" style="color:#ffd600;"></i> ${game.rating}</span>
                <span><i class="fas fa-database"></i> ${game.fileSize || 'Bilinmiyor'}</span>
                <span><i class="fas fa-cloud-download-alt"></i> ${(game.downloads || 0).toLocaleString()} indirme</span>
              </div>
              <p>${game.description.slice(0, 120)}...</p>
              <div class="download-card-tags">
                ${game.tags.slice(0, 3).map(t => `<span class="game-tag">${t}</span>`).join('')}
              </div>
            </div>
          </div>
          <div class="download-card-right">
            <a href="download-redirect.html?id=${game.id}" class="dl-direct-btn" onclick="trackDownload(${game.id})">
              <i class="fas fa-download"></i>
              <div>
                <strong>${isFree ? 'Ücretsiz İndir' : 'Oyunu İndir'}</strong>
                <small>${game.fileSize || ''}</small>
              </div>
            </a>
            <a href="game-detail.html?id=${game.id}" class="dl-detail-btn">
              <i class="fas fa-info-circle"></i> Detaylar
            </a>
          </div>
        </div>
      `;
    }).join('') : `
      <div class="empty-state" style="grid-column:1/-1;">
        <i class="fas fa-download"></i>
        <p>Aradığın oyun bulunamadı.</p>
        <button class="btn-secondary" onclick="resetFilters()" style="margin-top:1rem;">
          <i class="fas fa-undo"></i> Filtreleri Sıfırla
        </button>
      </div>
    `;

    if (loadMoreBtn) loadMoreBtn.style.display = visibleCount >= filtered.length ? 'none' : 'block';
  }

  window.resetFilters = function() {
    if (categoryFilter) categoryFilter.value = 'all';
    if (typeFilter) typeFilter.value = 'all';
    if (sortFilter) sortFilter.value = 'popular';
    if (searchInput) searchInput.value = '';
    currentCategory = 'all'; currentType = 'all'; currentSort = 'popular'; currentQuery = '';
    visibleCount = 12;
    render();
  };

  if (categoryFilter) categoryFilter.addEventListener('change', (e) => { currentCategory = e.target.value; visibleCount = 12; render(); });
  if (typeFilter) typeFilter.addEventListener('change', (e) => { currentType = e.target.value; visibleCount = 12; render(); });
  if (sortFilter) sortFilter.addEventListener('change', (e) => { currentSort = e.target.value; visibleCount = 12; render(); });
  if (searchInput) searchInput.addEventListener('input', (e) => { currentQuery = e.target.value; visibleCount = 12; render(); });
  if (loadMoreBtn) loadMoreBtn.addEventListener('click', () => { visibleCount += 12; render(); });

  const params = new URLSearchParams(window.location.search);
  if (params.get('category')) { currentCategory = params.get('category'); if (categoryFilter) categoryFilter.value = currentCategory; }
  if (params.get('type')) { currentType = params.get('type'); if (typeFilter) typeFilter.value = currentType; }
  if (params.get('sort')) { currentSort = params.get('sort'); if (sortFilter) sortFilter.value = currentSort; }

  render();
});

function trackDownload(gameId) {
  const stats = JSON.parse(localStorage.getItem('wado_download_stats') || '{}');
  if (!stats[gameId]) stats[gameId] = { total: 0 };
  stats[gameId].total = (stats[gameId].total || 0) + 1;
  localStorage.setItem('wado_download_stats', JSON.stringify(stats));
}
