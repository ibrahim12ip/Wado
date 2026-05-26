document.addEventListener('DOMContentLoaded', () => {
  renderHeroSlider();
  renderPopularGames();
  renderLatestNews();
  renderEditorsChoice();
  renderTopDownloads();
  renderLatestReviews();
  renderLatestBlog();
  renderSysReqBanner();
  initSwipers();
});

function renderHeroSlider() {
  const container = document.getElementById('heroSlider');
  if (!container) return;
  const popular = WADO.getPopular().slice(0, 5);
  container.innerHTML = popular.map((game, i) => `
    <div class="swiper-slide hero-slide">
      <div class="hero-bg" style="background-image:url('${game.image}')"></div>
      <div class="hero-content">
        <span class="hero-badge" style="background:linear-gradient(135deg,${i === 0 ? '#00e676,#00c853' : i === 1 ? '#00d4ff,#8b5cf6' : '#ffd600,#ffab00'});color:#000">${i === 0 ? 'Editörün Seçimi' : i === 1 ? 'Popüler' : 'Yeni Çıkan'}</span>
        <h1>${game.title}</h1>
        <p>${game.description.slice(0, 150)}...</p>
        <div class="hero-meta">
          <span><i class="fas fa-star"></i> ${game.rating}</span>
          <span><i class="fas fa-calendar"></i> ${game.year}</span>
          <span><i class="fas fa-tag"></i> ${game.category}</span>
        </div>
        <div class="hero-buttons">
          <a href="game-detail.html?id=${game.id}" class="btn-primary"><i class="fas fa-info-circle"></i> Detaylar</a>
          <a href="download-redirect.html?id=${game.id}" class="btn-secondary"><i class="fas fa-download"></i> İndir</a>
        </div>
      </div>
    </div>
  `).join('');
}

function renderPopularGames() {
  const container = document.getElementById('popularGamesContainer');
  if (!container) return;
  const games = WADO.getPopular().slice(0, 10);
  container.innerHTML = games.map(game => createGameCard(game)).join('');
}

function createGameCard(game) {
  return `
    <div class="swiper-slide">
      <div class="game-card" onclick="window.location='game-detail.html?id=${game.id}'">
        <div class="game-card-image">
          <img src="${game.image}" alt="${game.title}" loading="lazy">
          <div class="game-card-overlay"></div>
          <div class="game-card-rating">${game.rating}</div>
          <div class="game-card-category">${game.category}</div>
        </div>
        <div class="game-card-body">
          <h3>${game.title}</h3>
          <p>${game.description.slice(0, 100)}...</p>
        </div>
        <div class="game-card-footer">
          <div class="game-card-tags">
            ${game.tags.slice(0, 2).map(t => `<span class="game-tag">${t}</span>`).join('')}
          </div>
          <span class="game-card-date">${game.year}</span>
        </div>
      </div>
    </div>
  `;
}

function renderLatestNews() {
  const container = document.getElementById('newsContainer');
  if (!container) return;
  const news = WADO.getLatestNews().slice(0, 3);
  container.innerHTML = news.map(item => `
    <div class="news-card" onclick="window.location='news.html#${item.id}'">
      <div class="news-card-image">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
      </div>
      <div class="news-card-body">
        <div class="news-card-date"><i class="fas fa-clock"></i> ${item.date}</div>
        <h3>${item.title}</h3>
        <p>${item.excerpt}</p>
      </div>
    </div>
  `).join('');
}

function renderEditorsChoice() {
  const container = document.getElementById('editorsChoiceContainer');
  if (!container) return;
  const games = WADO.getEditorsChoice().slice(0, 4);
  container.innerHTML = games.map(game => `
    <div class="featured-card" onclick="window.location='game-detail.html?id=${game.id}'">
      <img src="${game.image}" alt="${game.title}" loading="lazy">
      <div class="featured-card-content">
        <div class="game-card-rating" style="position:relative;top:auto;right:auto;display:inline-flex;margin-bottom:1rem;">${game.rating}</div>
        <h3>${game.title}</h3>
        <p>${game.description.slice(0, 120)}...</p>
      </div>
    </div>
  `).join('');
}

function renderTopDownloads() {
  const container = document.getElementById('topDownloadsContainer');
  if (!container) return;
  const games = WADO.getTopDownloads(8);
  container.innerHTML = games.map(game => {
    const dl = WADO.downloads[game.id] || {};
    const isFree = dl.type === 'free';
    return `
      <div class="game-card" onclick="window.location='download-redirect.html?id=${game.id}'">
        <div class="game-card-image">
          <img src="${game.image}" alt="${game.title}" loading="lazy">
          <div class="game-card-overlay"></div>
          <div class="game-card-rating">${game.rating}</div>
          <div class="game-card-category">${game.category}</div>
          <div class="game-card-download-badge" style="background:linear-gradient(135deg,${isFree ? '#00e676,#00c853' : '#00d4ff,#8b5cf6'});">
            <i class="fas fa-download"></i> ${(dl.downloads || 0) >= 1000 ? Math.floor(dl.downloads / 1000) + 'K' : dl.downloads}
          </div>
        </div>
        <div class="game-card-body">
          <h3>${game.title}</h3>
          <p>${game.description.slice(0, 100)}...</p>
        </div>
        <div class="game-card-footer">
          <div class="game-card-tags">
            ${game.tags.slice(0, 2).map(t => `<span class="game-tag">${t}</span>`).join('')}
            <span class="game-tag"><i class="fas fa-database"></i> ${dl.fileSize || '—'}</span>
            ${isFree ? '<span class="game-tag" style="background:rgba(0,230,118,0.15);color:#00e676;border-color:transparent;">Ücretsiz</span>' : ''}
          </div>
          <span class="game-card-date"><i class="fas fa-download"></i> ${(dl.downloads || 0).toLocaleString()}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderLatestReviews() {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;
  const reviews = WADO.getLatestReviews().slice(0, 3);
  container.innerHTML = reviews.map(r => {
    const scoreClass = r.score >= 9 ? 'high' : r.score >= 8 ? 'mid' : 'low';
    return `
      <div class="review-card">
        <div class="review-card-image">
          <img src="${r.image}" alt="${r.title}" loading="lazy">
          <div class="review-score ${scoreClass}">${r.score}</div>
        </div>
        <div class="review-card-body">
          <h3>${r.title}</h3>
          <div class="review-sub"><i class="fas fa-user"></i> ${r.author} · <i class="fas fa-calendar"></i> ${r.date}</div>
          <p>${r.excerpt}</p>
        </div>
      </div>
    `;
  }).join('');
}

function renderLatestBlog() {
  const container = document.getElementById('blogContainer');
  if (!container) return;
  const posts = WADO.getLatestBlog().slice(0, 3);
  container.innerHTML = posts.map(p => `
    <div class="blog-card" onclick="window.location='blog-post.html?id=${p.id}'">
      <div class="blog-card-image">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
      </div>
      <div class="blog-card-body">
        <div class="blog-card-meta">
          <span><i class="fas fa-user"></i> ${p.author}</span>
          <span><i class="fas fa-clock"></i> ${p.readTime}</span>
          <span><i class="fas fa-calendar"></i> ${p.date}</span>
        </div>
        <h3>${p.title}</h3>
        <p>${p.content.slice(0, 120)}...</p>
        <div class="blog-card-footer">
          <div class="blog-card-author">
            <img src="${p.authorImage}" alt="${p.author}">
            <span>${p.author}</span>
          </div>
          <a href="blog-post.html?id=${p.id}" class="blog-card-read">Devamı <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  `).join('');
}

function renderSysReqBanner() {
  // Already in HTML, no need to render
}

function initSwipers() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.heroSwiper', {
    loop: true,
    autoplay: { delay: 6000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    effect: 'fade',
    fadeEffect: { crossFade: true }
  });

  new Swiper('.gamesSwiper', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    freeMode: true,
    grabCursor: true
  });
}
