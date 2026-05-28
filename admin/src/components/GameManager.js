import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'wado_games';

function loadGames() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return [
    { id: 1, title: 'Cyberpunk 2077', category: 'rpg', rating: 8.7, developer: 'CD Projekt Red', downloadType: 'paid', fileSize: '70 GB', downloadUrl: 'https://store.steampowered.com/app/1091500/Cyberpunk_2077/', downloads: 15420 },
    { id: 2, title: 'Elden Ring', category: 'rpg', rating: 9.5, developer: 'FromSoftware', downloadType: 'paid', fileSize: '60 GB', downloadUrl: 'https://store.steampowered.com/app/1245620/ELDEN_RING/', downloads: 12800 },
    { id: 3, title: 'God of War Ragnarök', category: 'action', rating: 9.4, developer: 'Santa Monica Studio', downloadType: 'paid', fileSize: '85 GB', downloadUrl: 'https://store.steampowered.com/app/2322010/God_of_War_Ragnarok/', downloads: 9200 },
  ];
}

function GameManager() {
  const [games, setGames] = useState(loadGames);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'action', rating: '', developer: '', downloadType: 'paid', fileSize: '', downloadUrl: '', downloads: '0' });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  }, [games]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = { ...form, rating: parseFloat(form.rating), downloads: parseInt(form.downloads) || 0 };
    if (editing) {
      setGames(games.map(g => g.id === editing.id ? { ...g, ...entry } : g));
    } else {
      setGames([...games, { id: Date.now(), ...entry }]);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ title: '', category: 'action', rating: '', developer: '', downloadType: 'paid', fileSize: '', downloadUrl: '', downloads: '0' });
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

  const handleExport = () => {
    const json = JSON.stringify(games, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'wado_games_export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (Array.isArray(imported)) {
          setGames(imported);
          alert(imported.length + ' oyun içe aktarıldı!');
        }
      } catch (err) {
        alert('Geçersiz dosya!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: 700 }}>
          <i className="fas fa-gamepad" style={{ color: '#00d4ff', marginRight: '10px' }}></i> Oyun Yönetimi
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="admin-btn edit" onClick={handleExport}>
            <i className="fas fa-download"></i> Dışa Aktar
          </button>
          <label className="admin-btn" style={{ background: 'var(--neon-purple)', cursor: 'pointer', padding: '8px 16px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <i className="fas fa-upload"></i> İçe Aktar
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
          <button className="admin-btn add" onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', category: 'action', rating: '', developer: '', downloadType: 'paid', fileSize: '', downloadUrl: '', downloads: '0' }); }}>
            <i className="fas fa-plus"></i> Yeni Oyun
          </button>
        </div>
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
                <label>Puan (0-10)</label>
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
                <label><i className="fas fa-link"></i> İndirme Linki</label>
                <input type="url" value={form.downloadUrl} onChange={e => setForm({ ...form, downloadUrl: e.target.value })} placeholder="https://github.com/.../releases/download/v1.0/dosya.rar" />
                <small style="color:#666;display:block;margin-top:4px;font-size:0.75rem">
                  <i class="fas fa-info-circle" style="color:#00d4ff"></i> 
                  GitHub Release linki yapıştır: <code style="color:#00d4ff;font-size:0.75rem">https://github.com/ibrahim12ip/Wado/releases/download/cdn-v1/dosya.rar</code>
                </small>
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
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0,212,255,0.05)', borderRadius: '8px', border: '1px solid var(--glass-border)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <i className="fas fa-info-circle" style={{ color: 'var(--neon-blue)', marginRight: '6px' }}></i>
            Eklenen oyunlar otomatik olarak tarayıcıya kaydedilir ve ana sitede görünür.
          </div>
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
      <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        Toplam: {games.length} oyun · Veriler tarayıcıya kaydedilir (localStorage)
      </div>
    </div>
  );
}

export default GameManager;
