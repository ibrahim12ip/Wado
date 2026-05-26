document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('allBlogContainer');
  const blogPostContainer = document.getElementById('blogPostContainer');

  if (container) renderBlogList();
  if (blogPostContainer) renderBlogPost();
});

function renderBlogList() {
  const container = document.getElementById('allBlogContainer');
  const filterSelect = document.getElementById('blogCategoryFilter');
  const searchInput = document.getElementById('blogSearchInput');
  let currentCategory = 'all', currentQuery = '';

  function filterPosts() {
    let posts = [...WADO.blogPosts];
    if (currentCategory !== 'all') posts = posts.filter(p => p.category === currentCategory);
    if (currentQuery) posts = WADO.searchBlog(currentQuery);
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function render() {
    const posts = filterPosts();
    container.innerHTML = posts.length ? posts.map(p => `
      <div class="blog-card" onclick="window.location='blog-post.html?id=${p.id}'">
        <div class="blog-card-image"><img src="${p.image}" alt="${p.title}" loading="lazy"></div>
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
    `).join('') : '<div class="empty-state"><i class="fas fa-newspaper"></i><p>Blog yazısı bulunamadı.</p></div>';
  }

  if (filterSelect) filterSelect.addEventListener('change', (e) => { currentCategory = e.target.value; render(); });
  if (searchInput) searchInput.addEventListener('input', (e) => { currentQuery = e.target.value; render(); });
  render();
}

function renderBlogPost() {
  const container = document.getElementById('blogPostContainer');
  const params = new URLSearchParams(window.location.search);
  const postId = parseInt(params.get('id'));
  const post = WADO.blogPosts.find(p => p.id === postId);

  if (!post) {
    container.innerHTML = '<div class="blog-post"><h1>Yazı bulunamadı.</h1><a href="blog.html" class="btn-primary">Blog'a Dön</a></div>';
    return;
  }

  document.title = `${post.title} - Wado`;

  const contentHtml = post.content.split('\n').filter(line => line.trim()).map(line => {
    if (line.startsWith('## ')) return `<h2><i class="fas fa-hashtag"></i> ${line.slice(3)}</h2>`;
    if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
    if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
    if (line.match(/^\d+\.\s/)) return `<li>${line.replace(/^\d+\.\s/, '')}</li>`;
    if (line.trim()) return `<p>${line}</p>`;
    return '';
  }).join('');

  container.innerHTML = `
    <article class="blog-post">
      <div class="blog-post-header">
        <div class="blog-card-meta">
          <span><i class="fas fa-user"></i> ${post.author}</span>
          <span><i class="fas fa-clock"></i> ${post.readTime}</span>
          <span><i class="fas fa-calendar"></i> ${post.date}</span>
        </div>
        <h1>${post.title}</h1>
      </div>
      <div class="blog-post-image">
        <img src="${post.image}" alt="${post.title}">
      </div>
      <div class="blog-post-content">
        ${contentHtml}
      </div>
      <div style="margin-top:2rem;padding-top:2rem;border-top:1px solid var(--glass-border);display:flex;gap:1rem;flex-wrap:wrap;">
        <a href="blog.html" class="btn-secondary"><i class="fas fa-arrow-left"></i> Blog'a Dön</a>
      </div>
    </article>
  `;
}
