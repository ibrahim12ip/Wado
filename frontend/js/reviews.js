document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('allReviewsContainer');
  if (!container) return;

  const sortSelect = document.getElementById('reviewSortFilter');
  const searchInput = document.getElementById('reviewSearchInput');
  let currentSort = 'newest', currentQuery = '';

  function filterReviews() {
    let reviews = [...WADO.reviews];
    if (currentQuery) reviews = reviews.filter(r => r.title.toLowerCase().includes(currentQuery.toLowerCase()) || r.excerpt.toLowerCase().includes(currentQuery.toLowerCase()));
    switch (currentSort) {
      case 'newest': reviews.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
      case 'highest': reviews.sort((a, b) => b.score - a.score); break;
      case 'lowest': reviews.sort((a, b) => a.score - b.score); break;
    }
    return reviews;
  }

  function render() {
    const reviews = filterReviews();
    container.innerHTML = reviews.length ? reviews.map(r => {
      const scoreClass = r.score >= 9 ? 'high' : r.score >= 8 ? 'mid' : 'low';
      const game = WADO.getGame(r.gameId);
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
            ${game ? `<a href="game-detail.html?id=${game.id}" class="btn-primary" style="margin-top:1rem;padding:0.5rem 1.2rem;font-size:0.85rem;"><i class="fas fa-info-circle"></i> Oyunu İncele</a>` : ''}
          </div>
        </div>
      `;
    }).join('') : '<div class="empty-state"><i class="fas fa-star"></i><p>İnceleme bulunamadı.</p></div>';
  }

  if (sortSelect) sortSelect.addEventListener('change', (e) => { currentSort = e.target.value; render(); });
  if (searchInput) searchInput.addEventListener('input', (e) => { currentQuery = e.target.value; render(); });
  render();
});
