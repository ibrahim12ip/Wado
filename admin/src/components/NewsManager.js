import React, { useState } from 'react';

function NewsManager() {
  const [news, setNews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Duyuru', excerpt: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setNews([{ id: Date.now(), ...form, date: new Date().toISOString().split('T')[0] }, ...news]);
    setShowForm(false);
    setForm({ title: '', category: 'Duyuru', excerpt: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Emin misiniz?')) setNews(news.filter(n => n.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: 700 }}>
          <i className="fas fa-bolt" style={{ color: '#ff0080', marginRight: '10px' }}></i> Haber Yönetimi
        </h2>
        <button className="admin-btn add" onClick={() => setShowForm(true)}><i className="fas fa-plus"></i> Yeni Haber</button>
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
                <option value="Duyuru">Duyuru</option><option value="Donanım">Donanım</option>
                <option value="Söylenti">Söylenti</option><option value="Etkinlik">Etkinlik</option>
              </select>
            </div>
            <div className="form-group">
              <label>Özet</label>
              <textarea rows="4" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} required
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '0.8rem', borderRadius: '8px' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="admin-btn add">Yayınla</button>
              <button type="button" className="admin-btn delete" onClick={() => setShowForm(false)}>İptal</button>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead><tr><th>ID</th><th>Başlık</th><th>Kategori</th><th>Tarih</th><th>İşlemler</th></tr></thead>
        <tbody>
          {news.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Henüz haber eklenmemiş.</td></tr>
          ) : news.map(n => (
            <tr key={n.id}>
              <td>#{n.id}</td>
              <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{n.title}</td>
              <td><span className="game-tag">{n.category}</span></td>
              <td>{n.date}</td>
              <td><button className="admin-btn delete" onClick={() => handleDelete(n.id)}><i className="fas fa-trash"></i></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NewsManager;
