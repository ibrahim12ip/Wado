import React, { useState } from 'react';

const gameData = [
  { id: 1, title: 'Cyberpunk 2077', category: 'rpg', rating: 8.7, developer: 'CD Projekt Red', downloadType: 'paid', fileSize: '70 GB', downloadUrl: 'https://cdn.wado.com/games/cyberpunk-2077.part1.rar', downloads: 15420 },
  { id: 2, title: 'Elden Ring', category: 'rpg', rating: 9.5, developer: 'FromSoftware', downloadType: 'paid', fileSize: '60 GB', downloadUrl: 'https://cdn.wado.com/games/elden-ring.part1.rar', downloads: 12800 },
  { id: 3, title: 'God of War Ragnarök', category: 'action', rating: 9.4, developer: 'Santa Monica Studio', downloadType: 'paid', fileSize: '85 GB', downloadUrl: 'https://cdn.wado.com/games/god-of-war-ragnarok.part1.rar', downloads: 9200 },
];

function GameManager() {
  const [games, setGames] = useState(gameData);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'action', rating: '', developer: '', downloadType: 'paid', fileSize: '', downloadUrl: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      setGames(games.map(g => g.id === editing.id ? { ...g, ...form, rating: parseFloat(form.rating), downloads: parseInt(form.downloads) || 0 } : g));
    } else {
      setGames([...games, { id: Date.now(), ...form, rating: parseFloat(form.rating), downloads: parseInt(form.downloads) || 0 }]);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ title: '', category: 'action', rating: '', developer: '', downloadType: 'paid', fileSize: '', downloadUrl: '' });
  };

  const handleEdit = (game) => {
    setEditing(game);
    setForm({ title: game.title, category: game.category, rating: game.rating.toString(), developer: game.developer, downloadType: game.downloadType || 'paid', fileSize: game.fileSize || '', downloadUrl: game.downloadUrl || '', downloads: game.downloads?.toString() || '0' });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu oyunu silmek istediğinize emin misiniz?')) {
      setGames(games.filter(g => g.id !== id));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: 700 }}>
          <i className="fas fa-gamepad" style={{ color: '#00d4ff', marginRight: '10px' }}></i> Oyun Yönetimi
        </h2>
        <button className="admin-btn add" onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', category: 'action', rating: '', developer: '', downloadType: 'paid', fileSize: '', downloadUrl: '' }); }}>
          <i className="fas fa-plus"></i> Yeni Oyun
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--card-radius)', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, marginBottom: '1rem' }}>
            {editing ? 'Oyun Düzenle' : 'Yeni Oyun Ekle'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Oyun Adı</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Kategori</label>
                <select className="filter-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ width: '100%' }}>
                  <option value="action">Action</option><option value="horror">Horror</option>
                  <option value="open-world">Open World</option><option value="racing">Racing</option>
                  <option value="rpg">RPG</option><option value="multiplayer">Multiplayer</option>
                  <option value="indie">Indie</option><option value="survival">Survival</option>
                </select>
              </div>
              <div className="form-group">
                <label>Puan</label>
                <input type="number" step="0.1" min="0" max="10" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Geliştirici</label>
                <input type="text" value={form.developer} onChange={e => setForm({ ...form, developer: e.target.value })} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', padding: '1rem', background: 'rgba(0,212,255,0.03)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
              <div className="form-group">
                <label><i className="fas fa-tag"></i> İndirme Türü</label>
                <select className="filter-select" value={form.downloadType} onChange={e => setForm({ ...form, downloadType: e.target.value })} style={{ width: '100%' }}>
                  <option value="paid">Premium (Ücretli)</option>
                  <option value="free">Ücretsiz (Free)</option>
                  <option value="demo">Demo</option>
                </select>
              </div>
              <div className="form-group">
                <label><i className="fas fa-database"></i> Dosya Boyutu</label>
                <input type="text" value={form.fileSize} onChange={e => setForm({ ...form, fileSize: e.target.value })} placeholder="örn. 70 GB" />
              </div>
              <div className="form-group">
                <label><i className="fas fa-link"></i> Doğrudan İndirme Linki</label>
                <input type="url" value={form.downloadUrl} onChange={e => setForm({ ...form, downloadUrl: e.target.value })} placeholder="https://cdn.wado.com/games/..." />
              </div>
              <div className="form-group">
                <label><i className="fas fa-download"></i> İndirme Sayısı</label>
                <input type="number" value={form.downloads} onChange={e => setForm({ ...form, downloads: e.target.value })} />
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="admin-btn add">{editing ? 'Güncelle' : 'Ekle'}</button>
              <button type="button" className="admin-btn delete" onClick={() => setShowForm(false)}>İptal</button>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th><th>Oyun Adı</th><th>Kategori</th><th>Puan</th><th>Geliştirici</th><th>Tür</th><th>İndirme</th><th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {games.map(game => (
            <tr key={game.id}>
              <td>#{game.id}</td>
              <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{game.title}</td>
              <td><span className="game-tag">{game.category}</span></td>
              <td style={{ color: game.rating >= 9 ? '#00e676' : game.rating >= 8 ? '#ffd600' : '#ff1744', fontWeight: 700 }}>{game.rating}</td>
              <td>{game.developer}</td>
              <td><span className={`game-tag ${game.downloadType === 'free' ? 'free-badge' : game.downloadType === 'demo' ? 'demo-badge' : ''}`}>{game.downloadType === 'free' ? 'Ücretsiz' : game.downloadType === 'demo' ? 'Demo' : 'Ücretli'}</span></td>
              <td style={{ color: 'var(--neon-blue)', fontWeight: 700 }}>{(game.downloads || 0).toLocaleString()}</td>
              <td>
                <button className="admin-btn edit" onClick={() => handleEdit(game)} style={{ marginRight: '0.5rem' }}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="admin-btn delete" onClick={() => handleDelete(game.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GameManager;
