import React, { useState } from 'react';

function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', score: '', excerpt: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setReviews([{ id: Date.now(), ...form, score: parseFloat(form.score), author: 'Wado Editör', date: new Date().toISOString().split('T')[0] }, ...reviews]);
    setShowForm(false);
    setForm({ title: '', score: '', excerpt: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Emin misiniz?')) setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: 700 }}>
          <i className="fas fa-star" style={{ color: '#ffd600', marginRight: '10px' }}></i> İnceleme Yönetimi
        </h2>
        <button className="admin-btn add" onClick={() => setShowForm(true)}><i className="fas fa-plus"></i> Yeni İnceleme</button>
      </div>

      {showForm && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--card-radius)', padding: '1.5rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Başlık</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Puan (0-10)</label>
                <input type="number" step="0.1" min="0" max="10" value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} required />
              </div>
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
        <thead><tr><th>ID</th><th>Başlık</th><th>Puan</th><th>Yazar</th><th>Tarih</th><th>İşlemler</th></tr></thead>
        <tbody>
          {reviews.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Henüz inceleme eklenmemiş.</td></tr>
          ) : reviews.map(r => (
            <tr key={r.id}>
              <td>#{r.id}</td>
              <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{r.title}</td>
              <td style={{ color: r.score >= 9 ? '#00e676' : r.score >= 8 ? '#ffd600' : '#ff1744', fontWeight: 700 }}>{r.score}</td>
              <td>{r.author}</td>
              <td>{r.date}</td>
              <td><button className="admin-btn delete" onClick={() => handleDelete(r.id)}><i className="fas fa-trash"></i></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewManager;
