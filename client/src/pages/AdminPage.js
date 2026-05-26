import React, { useState, useEffect } from 'react';
import {
  FiGrid, FiUsers, FiDownload, FiMessageSquare, FiPlus, FiEdit2, FiTrash2,
  FiBarChart2, FiSliders, FiImage, FiDollarSign, FiFileText
} from 'react-icons/fi';

const AdminPage = () => {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [adverts, setAdverts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [gameForm, setGameForm] = useState({ title: '', description: '', category: '', coverImage: '', size: '', version: '', isFeatured: false, isLowSpec: false, isOnline: false });
  const [sliderForm, setSliderForm] = useState({ title: '', subtitle: '', backgroundImage: '', buttonText: 'İndir', link: '', order: 0 });

  const API_BASE = '/api/admin';
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };

  const fetchData = async (endpoint, setter) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { headers });
      const data = await res.json();
      setter(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchData('/dashboard', setStats);
    if (tab === 'games') fetchData('/games?limit=50', d => setGames(d.games || d));
    if (tab === 'users') fetchData('/users', setUsers);
    if (tab === 'sliders') fetchData('/sliders', setSliders);
    if (tab === 'adverts') fetchData('/adverts', setAdverts);
    if (tab === 'categories') fetchData('/categories', d => {
      // Check if it's the admin endpoint response or public endpoint
      if (Array.isArray(d)) setCategories(d);
      else fetch('/api/categories').then(r => r.json()).then(setCategories);
    });
    if (tab === 'comments') fetchData('/comments', setComments);
    if (tab === 'blogs') fetchData('/blogs?limit=50', d => setBlogs(d.blogs || d));
  }, [tab]);

  const handleCreateGame = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/games`, { method: 'POST', headers, body: JSON.stringify(gameForm) });
      if (res.ok) { alert('Oyun eklendi!'); setGameForm({ title: '', description: '', category: '', coverImage: '', size: '', version: '', isFeatured: false, isLowSpec: false, isOnline: false }); }
    } catch (err) { alert('Hata: ' + err.message); }
  };

  const handleDelete = async (endpoint, id) => {
    if (!window.confirm('Emin misiniz?')) return;
    try {
      await fetch(`${API_BASE}${endpoint}/${id}`, { method: 'DELETE', headers });
      alert('Silindi!');
      if (endpoint === '/games') fetchData('/games?limit=50', d => setGames(d.games || d));
      if (endpoint === '/sliders') fetchData('/sliders', setSliders);
      if (endpoint === '/adverts') fetchData('/adverts', setAdverts);
      if (endpoint === '/comments') fetchData('/comments', setComments);
      if (endpoint === '/blogs') fetchData('/blogs?limit=50', d => setBlogs(d.blogs || d));
    } catch (err) { alert('Hata'); }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiBarChart2 },
    { id: 'games', label: 'Oyunlar', icon: FiGrid },
    { id: 'add-game', label: 'Oyun Ekle', icon: FiPlus },
    { id: 'sliders', label: 'Slider', icon: FiSliders },
    { id: 'categories', label: 'Kategoriler', icon: FiGrid },
    { id: 'users', label: 'Kullanıcılar', icon: FiUsers },
    { id: 'comments', label: 'Yorumlar', icon: FiMessageSquare },
    { id: 'adverts', label: 'Reklamlar', icon: FiDollarSign },
    { id: 'blogs', label: 'Bloglar', icon: FiFileText },
  ];

  return (
    <div className="page-container">
      <div className="admin-page">
        <div className="admin-sidebar">
          <h2 className="admin-title">Admin Panel</h2>
          <nav className="admin-nav">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} className={`admin-nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                  <Icon /> {t.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="admin-content">
          {tab === 'dashboard' && stats && (
            <div>
              <h2>Dashboard</h2>
              <div className="admin-stats">
                <div className="admin-stat-card purple"><FiGrid /> <div><strong>{stats.totalGames}</strong><span>Oyun</span></div></div>
                <div className="admin-stat-card cyan"><FiUsers /> <div><strong>{stats.totalUsers}</strong><span>Kullanıcı</span></div></div>
                <div className="admin-stat-card pink"><FiDownload /> <div><strong>{stats.totalDownloads}</strong><span>İndirme</span></div></div>
                <div className="admin-stat-card green"><FiMessageSquare /> <div><strong>{stats.totalComments}</strong><span>Yorum</span></div></div>
              </div>
              <div className="admin-lists">
                <div className="admin-list-card">
                  <h3>Son Eklenen Oyunlar</h3>
                  {stats.recentGames?.map(g => <div key={g._id} className="admin-list-item">{g.title} <span>{g.downloadCount} ind.</span></div>)}
                </div>
                <div className="admin-list-card">
                  <h3>En Popüler Oyunlar</h3>
                  {stats.popularGames?.map(g => <div key={g._id} className="admin-list-item">{g.title} <span>{g.downloadCount} ind.</span></div>)}
                </div>
              </div>
            </div>
          )}

          {tab === 'games' && (
            <div>
              <h2>Oyun Yönetimi</h2>
              <div className="admin-table">
                {games.map(g => (
                  <div key={g._id} className="admin-row">
                    <img src={g.coverImage} alt="" style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
                    <span className="row-title">{g.title}</span>
                    <span>{g.downloadCount} ind.</span>
                    <span>{g.viewCount} gör.</span>
                    <button onClick={() => handleDelete('/games', g._id)} className="btn-icon danger"><FiTrash2 /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'add-game' && (
            <div>
              <h2>Yeni Oyun Ekle</h2>
              <form onSubmit={handleCreateGame} className="admin-form">
                <div className="form-row">
                  <div className="form-group"><label>Oyun Adı</label><input value={gameForm.title} onChange={e => setGameForm({ ...gameForm, title: e.target.value })} required /></div>
                  <div className="form-group"><label>Boyut</label><input value={gameForm.size} onChange={e => setGameForm({ ...gameForm, size: e.target.value })} placeholder="örn: 15.6 GB" /></div>
                </div>
                <div className="form-group"><label>Açıklama</label><textarea rows={4} value={gameForm.description} onChange={e => setGameForm({ ...gameForm, description: e.target.value })} required /></div>
                <div className="form-row">
                  <div className="form-group"><label>Kapak Görseli URL</label><input value={gameForm.coverImage} onChange={e => setGameForm({ ...gameForm, coverImage: e.target.value })} /></div>
                  <div className="form-group"><label>Versiyon</label><input value={gameForm.version} onChange={e => setGameForm({ ...gameForm, version: e.target.value })} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Kategori ID</label><input value={gameForm.category} onChange={e => setGameForm({ ...gameForm, category: e.target.value })} /></div>
                </div>
                <div className="form-checkboxes">
                  <label><input type="checkbox" checked={gameForm.isFeatured} onChange={e => setGameForm({ ...gameForm, isFeatured: e.target.checked })} /> Öne Çıkan</label>
                  <label><input type="checkbox" checked={gameForm.isLowSpec} onChange={e => setGameForm({ ...gameForm, isLowSpec: e.target.checked })} /> Düşük Sistem</label>
                  <label><input type="checkbox" checked={gameForm.isOnline} onChange={e => setGameForm({ ...gameForm, isOnline: e.target.checked })} /> Online</label>
                </div>
                <button type="submit" className="btn-primary">Oyunu Ekle</button>
              </form>
            </div>
          )}

          {tab === 'sliders' && (
            <div>
              <h2>Slider Yönetimi</h2>
              <form className="admin-form" onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await fetch(`${API_BASE}/sliders`, { method: 'POST', headers, body: JSON.stringify(sliderForm) });
                  if (res.ok) { alert('Slider eklendi!'); fetchData('/sliders', setSliders); setSliderForm({ title: '', subtitle: '', backgroundImage: '', buttonText: 'İndir', link: '', order: 0 }); }
                } catch (err) { alert('Hata'); }
              }}>
                <div className="form-row">
                  <div className="form-group"><label>Başlık</label><input value={sliderForm.title} onChange={e => setSliderForm({ ...sliderForm, title: e.target.value })} required /></div>
                  <div className="form-group"><label>Alt Başlık</label><input value={sliderForm.subtitle} onChange={e => setSliderForm({ ...sliderForm, subtitle: e.target.value })} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Görsel URL</label><input value={sliderForm.backgroundImage} onChange={e => setSliderForm({ ...sliderForm, backgroundImage: e.target.value })} /></div>
                  <div className="form-group"><label>Sıra</label><input type="number" value={sliderForm.order} onChange={e => setSliderForm({ ...sliderForm, order: parseInt(e.target.value) })} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Buton Metni</label><input value={sliderForm.buttonText} onChange={e => setSliderForm({ ...sliderForm, buttonText: e.target.value })} /></div>
                  <div className="form-group"><label>Link</label><input value={sliderForm.link} onChange={e => setSliderForm({ ...sliderForm, link: e.target.value })} /></div>
                </div>
                <button type="submit" className="btn-primary">Slider Ekle</button>
              </form>
              <div className="admin-table" style={{ marginTop: 24 }}>
                {sliders.map(s => (
                  <div key={s._id} className="admin-row">
                    <span className="row-title">{s.title}</span>
                    <span>Sıra: {s.order}</span>
                    <button onClick={() => handleDelete('/sliders', s._id)} className="btn-icon danger"><FiTrash2 /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div>
              <h2>Kullanıcı Yönetimi</h2>
              <div className="admin-table">
                {users.map(u => (
                  <div key={u._id} className="admin-row">
                    <span className="row-title">{u.username}</span>
                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                    <span>{u.email}</span>
                    <span style={{ color: u.isBanned ? '#ef4444' : '#10b981' }}>{u.isBanned ? 'Banlı' : 'Aktif'}</span>
                    <button onClick={async () => {
                      await fetch(`${API_BASE}/users/${u._id}/${u.isBanned ? 'unban' : 'ban'}`, { method: 'PUT', headers });
                      fetchData('/users', setUsers);
                    }} className="btn-icon">{u.isBanned ? 'Aç' : 'Banla'}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'comments' && (
            <div>
              <h2>Yorum Yönetimi</h2>
              <div className="admin-table">
                {comments.map(c => (
                  <div key={c._id} className="admin-row">
                    <span className="row-title">{c.user?.username}</span>
                    <span style={{ flex: 1, color: 'var(--text-secondary)', fontSize: 14 }}>{c.content?.substring(0, 60)}...</span>
                    <button onClick={() => handleDelete('/comments', c._id)} className="btn-icon danger"><FiTrash2 /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'categories' && (
            <div>
              <h2>Kategoriler</h2>
              <div className="admin-table">
                {categories.map(c => (
                  <div key={c._id} className="admin-row">
                    <span className="row-title">{c.name}</span>
                    <span style={{ color: c.color }}>●</span>
                    <span>{c.gameCount || 0} oyun</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'adverts' && (
            <div>
              <h2>Reklam Yönetimi</h2>
              <div className="admin-table">
                {adverts.map(a => (
                  <div key={a._id} className="admin-row">
                    <span className="row-title">{a.name}</span>
                    <span>{a.type}</span>
                    <span>{a.position}</span>
                    <span style={{ color: a.isActive ? '#10b981' : '#ef4444' }}>{a.isActive ? 'Aktif' : 'Pasif'}</span>
                    <button onClick={() => handleDelete('/adverts', a._id)} className="btn-icon danger"><FiTrash2 /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'blogs' && (
            <div>
              <h2>Blog Yönetimi</h2>
              <div className="admin-table">
                {blogs.map(b => (
                  <div key={b._id} className="admin-row">
                    <span className="row-title">{b.title}</span>
                    <span>{b.category}</span>
                    <span>{b.viewCount} gör.</span>
                    <button onClick={() => handleDelete('/blogs', b._id)} className="btn-icon danger"><FiTrash2 /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-page { display: flex; min-height: calc(100vh - var(--header-height)); }
        .admin-sidebar { width: 220px; background: var(--bg-secondary); border-right: 1px solid var(--border-color); padding: 24px 0; flex-shrink: 0; }
        .admin-title { font-size: 14px; font-weight: 700; padding: 0 20px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); }
        .admin-nav { display: flex; flex-direction: column; gap: 2px; }
        .admin-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 20px; font-size: 14px; font-weight: 500;
          color: var(--text-secondary); background: none; width: 100%; text-align: left;
          transition: var(--transition);
          svg { font-size: 16px; }
          &:hover { background: var(--bg-hover); color: var(--text-primary); }
          &.active { color: var(--accent-purple-light); background: rgba(124,58,237,0.1); border-right: 3px solid var(--accent-purple); }
        }
        .admin-content { flex: 1; padding: 32px; overflow-y: auto; h2 { font-size: 22px; font-weight: 700; margin-bottom: 24px; } }
        .admin-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .admin-stat-card {
          background: var(--bg-card); padding: 20px; border-radius: var(--radius-md);
          border: 1px solid var(--border-color); display: flex; align-items: center; gap: 16px;
          svg { font-size: 28px; } div { display: flex; flex-direction: column; } strong { font-size: 24px; font-weight: 800; } span { font-size: 13px; color: var(--text-secondary); }
          &.purple svg { color: var(--accent-purple); } &.cyan svg { color: var(--accent-cyan); } &.pink svg { color: var(--accent-pink); } &.green svg { color: #10b981; }
        }
        .admin-lists { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .admin-list-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; h3 { font-size: 16px; margin-bottom: 12px; } }
        .admin-list-item { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: var(--text-secondary); border-bottom: 1px solid var(--border-color); &:last-child { border: none; } span { color: var(--text-muted); font-size: 12px; } }
        .admin-table { display: flex; flex-direction: column; gap: 8px; }
        .admin-row {
          display: flex; align-items: center; gap: 16px;
          background: var(--bg-card); padding: 12px 16px; border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          .row-title { flex: 1; font-weight: 500; font-size: 14px; }
        }
        .admin-form { background: var(--bg-card); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-checkboxes { display: flex; gap: 20px; margin: 16px 0; label { display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; } input { width: auto; } }
        .btn-icon { background: none; padding: 6px; border-radius: 6px; color: var(--text-secondary); font-size: 16px; transition: var(--transition); &:hover { background: var(--bg-hover); } &.danger { color: #ef4444; &:hover { background: rgba(239,68,68,0.1); } } }
        @media (max-width: 768px) {
          .admin-page { flex-direction: column; }
          .admin-sidebar { width: 100%; padding: 12px 0; }
          .admin-nav { flex-direction: row; overflow-x: auto; padding: 0 12px; }
          .admin-nav-item { white-space: nowrap; }
          .admin-content { padding: 16px; }
          .form-row { grid-template-columns: 1fr; }
          .admin-lists { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
