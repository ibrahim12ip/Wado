import React, { useState } from 'react';

function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'fps', content: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setPosts([{ id: Date.now(), ...form, author: 'Wado Editör', date: new Date().toISOString().split('T')[0] }, ...posts]);
    setShowForm(false);
    setForm({ title: '', category: 'fps', content: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Silmek istediğinize emin misiniz?')) setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: 700 }}>
          <i className="fas fa-newspaper" style={{ color: '#8b5cf6', marginRight: '10px' }}></i> Blog Yönetimi
        </h2>
        <button className="admin-btn add" onClick={() => setShowForm(true)}><i className="fas fa-plus"></i> Yeni Yazı</button>
      </div>

      {showForm && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--card-radius)', padding: '1.5rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Başlık</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Kategori</label>
              <select className="filter-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ width: '100%' }}>
                <option value="fps">FPS</option><option value="low-system">Düşük Sistem</option>
                <option value="hardware">Donanım</option><option value="multiplayer">Multiplayer</option>
                <option value="horror">Korku</option><option value="racing">Yarış</option>
              </select>
            </div>
            <div className="form-group">
              <label>İçerik (Markdown)</label>
              <textarea rows="8" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '0.8rem', borderRadius: '8px', fontFamily: 'monospace' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="admin-btn add">Yayınla</button>
              <button type="button" className="admin-btn delete" onClick={() => setShowForm(false)}>İptal</button>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead><tr><th>ID</th><th>Başlık</th><th>Kategori</th><th>Yazar</th><th>Tarih</th><th>İşlemler</th></tr></thead>
        <tbody>
          {posts.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Henüz blog yazısı eklenmemiş.</td></tr>
          ) : posts.map(p => (
            <tr key={p.id}>
              <td>#{p.id}</td>
              <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p.title}</td>
              <td><span className="game-tag">{p.category}</span></td>
              <td>{p.author}</td>
              <td>{p.date}</td>
              <td><button className="admin-btn delete" onClick={() => handleDelete(p.id)}><i className="fas fa-trash"></i></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BlogManager;
