import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { FiArrowUp, FiClock, FiStar } from 'react-icons/fi';

const pageConfig = {
  'pc-oyunlari': { title: 'Tüm PC Oyunları', icon: '🖥️', endpoint: '/api/games' },
  'yeni-oyunlar': { title: 'Yeni Oyunlar', icon: '🆕', endpoint: '/api/games?sort=new' },
  'populer': { title: 'Popüler Oyunlar', icon: '🔥', endpoint: '/api/games?sort=popular' },
  'dusuk-sistem': { title: 'Düşük Sistem Oyunları', icon: '⚡', endpoint: '/api/games/low-spec' },
  'online-oyunlar': { title: 'Online Oyunlar', icon: '🌐', endpoint: '/api/games?isOnline=true' },
  'editor-secimi': { title: 'Editörün Seçimi', icon: '⭐', endpoint: '/api/games/editor-picks' },
};

const BrowsePage = () => {
  const location = useLocation();
  const type = location.pathname.replace('/', '');
  const config = pageConfig[type];
  const [games, setGames] = useState([]);
  const [sort, setSort] = useState('new');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const base = config?.endpoint || '/api/games';
    fetch(`${base}${base.includes('?') ? '&' : '?'}sort=${sort}&limit=20`)
      .then(r => r.json())
      .then(data => setGames(data.games || data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [type, sort]);

  if (!config) return <div className="page-container"><p style={{ padding: 40, textAlign: 'center' }}>Sayfa bulunamadı</p></div>;

  return (
    <div className="page-container">
      <div className="browse-page">
        <div className="browse-header">
          <h1><span className="browse-icon">{config.icon}</span> {config.title}</h1>
          <div className="sort-bar">
            {['new', 'popular', 'rating'].map(s => (
              <button key={s} className={`sort-btn ${sort === s ? 'active' : ''}`} onClick={() => setSort(s)}>
                {s === 'new' ? <FiClock /> : s === 'popular' ? <FiArrowUp /> : <FiStar />}
                {s === 'new' ? 'Yeni' : s === 'popular' ? 'Popüler' : 'Puan'}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>Yükleniyor...</div>
        ) : (
          <div className="game-grid">
            {games.map(game => <GameCard key={game._id} game={game} />)}
          </div>
        )}
      </div>
      <style>{`
        .browse-page { padding: 24px; max-width: 1400px; margin: 0 auto; }
        .browse-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .browse-header h1 { font-size: 28px; font-weight: 800; display: flex; align-items: center; gap: 10px; }
        .browse-icon { font-size: 28px; }
        .sort-bar { display: flex; gap: 8px; background: var(--bg-card); padding: 4px; border-radius: var(--radius-sm); }
        .sort-btn {
          display: flex; align-items: center; gap: 6px; padding: 8px 16px;
          border-radius: 6px; font-size: 13px; font-weight: 500;
          color: var(--text-secondary); background: none; transition: var(--transition);
          &:hover { color: var(--text-primary); }
          &.active { background: var(--accent-purple); color: white; }
        }
        @media (max-width: 768px) { .browse-page { padding: 12px; } }
      `}</style>
    </div>
  );
};

export default BrowsePage;
