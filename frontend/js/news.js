document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('allNewsContainer');
  const sysReqContainer = document.getElementById('sysReqContainer');
  if (container) renderNewsList();
  if (sysReqContainer) renderSysReqList();
});

function renderNewsList() {
  const container = document.getElementById('allNewsContainer');
  const loadMoreBtn = document.getElementById('loadMoreNews');
  let visibleCount = 6;

  function render() {
    const news = WADO.getLatestNews();
    const toShow = news.slice(0, visibleCount);
    container.innerHTML = toShow.map(item => `
      <div class="news-card">
        <div class="news-card-image"><img src="${item.image}" alt="${item.title}" loading="lazy"></div>
        <div class="news-card-body">
          <div class="news-card-date"><i class="fas fa-clock"></i> ${item.date} · <span style="color:var(--neon-blue)">${item.category}</span></div>
          <h3>${item.title}</h3>
          <p>${item.excerpt}</p>
        </div>
      </div>
    `).join('');
    if (loadMoreBtn) loadMoreBtn.style.display = visibleCount >= news.length ? 'none' : 'block';
  }

  if (loadMoreBtn) loadMoreBtn.addEventListener('click', () => { visibleCount += 6; render(); });
  render();
}

function renderSysReqList() {
  const container = document.getElementById('sysReqContainer');
  const searchInput = document.getElementById('sysReqSearch');
  if (!container) return;

  let currentQuery = '';

  function render() {
    let games = currentQuery ? WADO.searchGames(currentQuery) : WADO.games;
    container.innerHTML = games.map(game => `
      <div class="sys-req-item">
        <div class="sys-req-item-header" onclick="this.parentElement.classList.toggle('open')">
          <div class="game-info">
            <img src="${game.image}" alt="${game.title}">
            <div>
              <h3>${game.title}</h3>
              <span style="font-size:0.8rem;color:var(--text-muted)">${game.developer} · ${game.year}</span>
            </div>
          </div>
          <i class="fas fa-chevron-down toggle-icon"></i>
        </div>
        <div class="sys-req-item-body">
          <div class="sys-req-columns">
            <div class="sys-req-col min">
              <h4><i class="fas fa-arrow-down"></i> Minimum Gereksinimler</h4>
              <ul>
                <li><strong>İşletim Sistemi:</strong> ${game.sysReq.min.os}</li>
                <li><strong>İşlemci:</strong> ${game.sysReq.min.cpu}</li>
                <li><strong>Bellek:</strong> ${game.sysReq.min.ram}</li>
                <li><strong>Ekran Kartı:</strong> ${game.sysReq.min.gpu}</li>
                <li><strong>Depolama:</strong> ${game.sysReq.min.storage}</li>
              </ul>
            </div>
            <div class="sys-req-col rec">
              <h4><i class="fas fa-arrow-up"></i> Önerilen Gereksinimler</h4>
              <ul>
                <li><strong>İşletim Sistemi:</strong> ${game.sysReq.rec.os}</li>
                <li><strong>İşlemci:</strong> ${game.sysReq.rec.cpu}</li>
                <li><strong>Bellek:</strong> ${game.sysReq.rec.ram}</li>
                <li><strong>Ekran Kartı:</strong> ${game.sysReq.rec.gpu}</li>
                <li><strong>Depolama:</strong> ${game.sysReq.rec.storage}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  if (searchInput) searchInput.addEventListener('input', (e) => { currentQuery = e.target.value; render(); });
  render();
}
