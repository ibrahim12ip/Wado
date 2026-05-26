document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('allGamesContainer');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const searchInput = document.getElementById('gameSearchInput');
  const loadMoreBtn = document.getElementById('loadMoreGames');

  let currentCategory = 'all', currentSort = 'popular', currentQuery = '';
  let visibleCount = 12;

  function filterGames() {
    let games = [...WADO.games];

    if (currentCategory !== 'all') games = games.filter(g => g.category === currentCategory);
    if (currentQuery) games = WADO.searchGames(currentQuery);

    switch (currentSort) {
      case 'popular': games.sort((a, b) => b.rating - a.rating); break;
      case 'newest': games.sort((a, b) => b.year - a.year || b.id - a.id); break;
      case 'rating': games.sort((a, b) => b.rating - a.rating); break;
      case 'name': games.sort((a, b) => a.title.localeCompare(b.title)); break;
    }

    return games;
  }

  function render() {
    const filtered = filterGames();
    const toShow = filtered.slice(0, visibleCount);
    container.innerHTML = toShow.length ? toShow.map(createGameCardFull).join('') :
      '<div class="empty-state"><i class="fas fa-search"></i><p>Oyun bulunamadı.</p></div>';
    if (loadMoreBtn) {
      loadMoreBtn.style.display = visibleCount >= filtered.length ? 'none' : 'block';
    }
  }

  function createGameCardFull(game) {
    const dl = WADO.downloads[game.id];
    return `
      <div class="game-card">
        <div class="game-card-image" onclick="window.location='game-detail.html?id=${game.id}'">
          <img src="${game.image}" alt="${game.title}" loading="lazy">
          <div class="game-card-overlay"></div>
          <div class="game-card-rating">${game.rating}</div>
          <div class="game-card-category">${game.category}</div>
          ${dl ? `<a href="download-redirect.html?id=${game.id}" class="game-card-download-badge" onclick="event.stopPropagation()" title="${(dl.downloads || 0).toLocaleString()} indirme">
            <i class="fas fa-download"></i> İndir
          </a>` : ''}
        </div>
        <div class="game-card-body" onclick="window.location='game-detail.html?id=${game.id}'">
          <h3>${game.title}</h3>
          <p>${game.description.slice(0, 100)}...</p>
        </div>
        <div class="game-card-footer">
          <div class="game-card-tags">
            ${game.tags.slice(0, 2).map(t => `<span class="game-tag">${t}</span>`).join('')}
            ${dl ? `<span class="game-tag"><i class="fas fa-database"></i> ${dl.fileSize}</span>` : ''}
            ${dl?.type === 'free' ? `<span class="game-tag" style="background:rgba(0,230,118,0.15);color:#00e676;border-color:transparent;">Ücretsiz</span>` : ''}
          </div>
          <a href="download-redirect.html?id=${game.id}" class="game-card-download-link">
            <i class="fas fa-download"></i>
          </a>
        </div>
      </div>
    `;
  }

  if (categoryFilter) categoryFilter.addEventListener('change', (e) => { currentCategory = e.target.value; visibleCount = 12; render(); });
  if (sortFilter) sortFilter.addEventListener('change', (e) => { currentSort = e.target.value; visibleCount = 12; render(); });
  if (searchInput) searchInput.addEventListener('input', (e) => { currentQuery = e.target.value; visibleCount = 12; render(); });
  if (loadMoreBtn) loadMoreBtn.addEventListener('click', () => { visibleCount += 12; render(); });

  render();
});
