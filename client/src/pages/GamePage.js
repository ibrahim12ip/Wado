import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiDownload, FiEye, FiStar, FiHeart, FiClock, FiHardDrive,
  FiMonitor, FiCpu, FiGlobe, FiCheck, FiAlertCircle, FiMessageSquare, FiPlay
} from 'react-icons/fi';

const GamePage = () => {
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/games/${slug}`);
        const data = await res.json();
        setGame(data);
      } catch (err) {
        console.error('Oyun yüklenemedi:', err);
      }
    };
    fetchGame();
  }, [slug]);

  if (!game) {
    return (
      <div className="page-container">
        <div className="loading">Oyun yükleniyor...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'description', label: 'Açıklama' },
    { id: 'story', label: 'Hikaye' },
    { id: 'requirements', label: 'Sistem Gereksinimleri' },
    { id: 'install', label: 'Kurulum' },
    { id: 'comments', label: 'Yorumlar' }
  ];

  return (
    <div className="page-container">
      <div className="game-detail">
        <div className="game-hero">
          <div className="hero-bg" style={{ backgroundImage: `url(${game.coverImage})` }} />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-left">
              <img className="hero-cover" src={game.coverImage || ''} alt={game.title} />
            </div>
            <div className="hero-right">
              <div className="hero-breadcrumb">
                <Link to="/">Ana Sayfa</Link> / <Link to={`/kategori/${game.category?.slug}`}>{game.category?.name}</Link> / <span>{game.title}</span>
              </div>
              <h1 className="hero-title">{game.title}</h1>
              <div className="hero-meta">
                <span className="meta-badge">{game.category?.name}</span>
                {game.size && <span className="meta-badge size">{game.size}</span>}
                {game.isOnline && <span className="meta-badge online">Online</span>}
                {game.version && <span className="meta-badge">v{game.version}</span>}
              </div>
              <div className="hero-stats">
                <span><FiDownload /> {game.downloadCount} İndirme</span>
                <span><FiEye /> {game.viewCount} Görüntüleme</span>
                <span><FiStar style={{ color: '#fbbf24' }} /> {game.rating?.toFixed(1)}</span>
              </div>
              <div className="hero-tags">
                {game.tags?.map(tag => (
                  <Link key={tag} to={`/arama?tag=${tag}`} className="tag">#{tag}</Link>
                ))}
              </div>
              <div className="hero-actions">
                <a href={game.downloadLinks?.[0]?.url || '#'} className="download-btn">
                  <FiDownload /> İndir
                </a>
                {game.hasTorrent && (
                  <a href={game.downloadLinks?.find(l => l.type === 'torrent')?.url || '#'} className="torrent-btn">
                    Torrent
                  </a>
                )}
              </div>
              <div className="hero-langs">
                <FiGlobe /> Diller: {game.languages?.join(', ') || 'Belirtilmemiş'}
                {game.hasTurkishPatch && <span className="turkish-patch">Türkçe Yama Mevcut</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="game-body">
          <div className="game-tabs">
            {tabs.map(tab => (
              <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-tab">
                <p>{game.description}</p>
                {game.screenshots?.length > 0 && (
                  <div className="screenshots">
                    <h3>Ekran Görüntüleri</h3>
                    <div className="screenshot-grid">
                      {game.screenshots.map((img, i) => (
                        <div key={i} className={`screenshot-item ${activeImage === i ? 'active' : ''}`}
                          onClick={() => setActiveImage(i)}>
                          <img src={img} alt={`${game.title} screenshot ${i + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {game.trailerUrl && (
                  <div className="trailer">
                    <h3><FiPlay /> Fragman</h3>
                    <iframe src={game.trailerUrl} title="Trailer" allowFullScreen />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'story' && (
              <div className="story-tab">
                <h3>Hikaye</h3>
                <p>{game.story || 'Hikaye bilgisi bulunmuyor.'}</p>
              </div>
            )}

            {activeTab === 'requirements' && (
              <div className="requirements-tab">
                <div className="req-grid">
                  <div className="req-card">
                    <h3><FiMonitor /> Minimum Sistem Gereksinimleri</h3>
                    <ul>
                      <li><FiCpu /> İşlemci: {game.systemRequirements?.minimum?.processor || 'Belirtilmemiş'}</li>
                      <li><FiHardDrive /> RAM: {game.systemRequirements?.minimum?.memory || 'Belirtilmemiş'}</li>
                      <li><FiMonitor /> Ekran Kartı: {game.systemRequirements?.minimum?.graphics || 'Belirtilmemiş'}</li>
                      <li><FiHardDrive /> Depolama: {game.systemRequirements?.minimum?.storage || 'Belirtilmemiş'}</li>
                      <li><FiCheck /> DirectX: {game.systemRequirements?.minimum?.directx || 'Belirtilmemiş'}</li>
                      <li><FiGlobe /> OS: {game.systemRequirements?.minimum?.os || 'Belirtilmemiş'}</li>
                    </ul>
                  </div>
                  <div className="req-card recommended">
                    <h3><FiStar /> Önerilen Sistem Gereksinimleri</h3>
                    <ul>
                      <li><FiCpu /> İşlemci: {game.systemRequirements?.recommended?.processor || 'Belirtilmemiş'}</li>
                      <li><FiHardDrive /> RAM: {game.systemRequirements?.recommended?.memory || 'Belirtilmemiş'}</li>
                      <li><FiMonitor /> Ekran Kartı: {game.systemRequirements?.recommended?.graphics || 'Belirtilmemiş'}</li>
                      <li><FiHardDrive /> Depolama: {game.systemRequirements?.recommended?.storage || 'Belirtilmemiş'}</li>
                      <li><FiCheck /> DirectX: {game.systemRequirements?.recommended?.directx || 'Belirtilmemiş'}</li>
                      <li><FiGlobe /> OS: {game.systemRequirements?.recommended?.os || 'Belirtilmemiş'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'install' && (
              <div className="install-tab">
                <h3>Kurulum Rehberi</h3>
                <div className="install-content" dangerouslySetInnerHTML={{ __html: game.installGuide || 'Kurulum rehberi bulunmuyor.' }} />
                <div className="install-links">
                  <h4>İndirme Linkleri</h4>
                  {game.downloadLinks?.map((link, i) => (
                    <a key={i} href={link.url} className="install-link">
                      <FiDownload /> {link.label || `Bağlantı ${i + 1}`}
                      {link.type === 'torrent' && <span className="link-type torrent">TORRENT</span>}
                      {link.type === 'part' && <span className="link-type part">PART</span>}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="comments-tab">
                <h3>Yorumlar</h3>
                <p>Yorum sistemi için giriş yapmalısınız.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .game-detail { padding: 24px; max-width: 1200px; margin: 0 auto; }
        .game-hero { position: relative; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 24px; min-height: 400px; }
        .hero-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          filter: blur(40px); opacity: 0.4;
          transform: scale(1.2);
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.6) 100%);
        }
        .hero-content { position: relative; z-index: 2; display: flex; gap: 32px; padding: 40px; }
        .hero-left { flex-shrink: 0; }
        .hero-cover { width: 260px; height: 360px; object-fit: cover; border-radius: var(--radius-md); box-shadow: var(--shadow-lg); }
        .hero-right { flex: 1; display: flex; flex-direction: column; gap: 12px; justify-content: center; }
        .hero-breadcrumb { font-size: 13px; color: var(--text-muted); a { color: var(--accent-purple-light); &:hover { text-decoration: underline; } } }
        .hero-title { font-size: 36px; font-weight: 900; }
        .hero-meta { display: flex; gap: 8px; flex-wrap: wrap; }
        .meta-badge {
          padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;
          background: rgba(124,58,237,0.15); color: var(--accent-purple-light);
          &.size { background: rgba(6,182,212,0.15); color: var(--accent-cyan); }
          &.online { background: rgba(236,72,153,0.15); color: var(--accent-pink); }
        }
        .hero-stats { display: flex; gap: 20px; font-size: 14px; color: var(--text-secondary); svg { vertical-align: middle; margin-right: 4px; } }
        .hero-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .tag { font-size: 12px; color: var(--text-muted); &:hover { color: var(--accent-purple-light); } }
        .hero-actions { display: flex; gap: 12px; margin-top: 8px; }
        .download-btn, .torrent-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: var(--radius-sm);
          font-weight: 700; font-size: 15px; transition: var(--transition);
        }
        .download-btn { background: linear-gradient(135deg, var(--accent-purple), var(--accent-purple-dark)); color: white; &:hover { box-shadow: var(--neon-glow); transform: translateY(-2px); } }
        .torrent-btn { background: transparent; border: 2px solid var(--accent-cyan); color: var(--accent-cyan); &:hover { background: rgba(6,182,212,0.1); } }
        .hero-langs { font-size: 13px; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; svg { flex-shrink: 0; } }
        .turkish-patch { background: rgba(6,182,212,0.15); color: var(--accent-cyan); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }

        .game-body { background: var(--bg-card); border-radius: var(--radius-lg); overflow: hidden; }
        .game-tabs { display: flex; border-bottom: 1px solid var(--border-color); overflow-x: auto; }
        .tab-btn {
          padding: 16px 24px; font-size: 14px; font-weight: 600;
          color: var(--text-secondary); background: none;
          border-bottom: 2px solid transparent;
          transition: var(--transition); white-space: nowrap;
          &:hover { color: var(--text-primary); background: var(--bg-hover); }
          &.active { color: var(--accent-purple-light); border-bottom-color: var(--accent-purple); }
        }
        .tab-content { padding: 32px; }
        .screenshot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-top: 16px; }
        .screenshot-item {
          border-radius: var(--radius-sm); overflow: hidden; cursor: pointer;
          border: 2px solid transparent; transition: var(--transition);
          &.active, &:hover { border-color: var(--accent-purple); }
          img { width: 100%; height: 120px; object-fit: cover; display: block; }
        }
        .trailer { margin-top: 24px; iframe { width: 100%; height: 400px; border-radius: var(--radius-md); border: none; margin-top: 12px; } }
        .req-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .req-card {
          background: var(--bg-secondary); padding: 24px; border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          h3 { font-size: 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
          ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
          li { font-size: 14px; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; svg { flex-shrink: 0; color: var(--accent-purple-light); } }
          &.recommended { border-color: rgba(6,182,212,0.2); li svg { color: var(--accent-cyan); } }
        }
        .install-link {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 16px; background: var(--bg-secondary);
          border: 1px solid var(--border-color); border-radius: var(--radius-sm);
          margin-bottom: 8px; font-size: 14px; transition: var(--transition);
          &:hover { border-color: var(--accent-purple); }
          .link-type {
            margin-left: auto; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px;
            &.torrent { background: rgba(6,182,212,0.15); color: var(--accent-cyan); }
            &.part { background: rgba(236,72,153,0.15); color: var(--accent-pink); }
          }
        }

        @media (max-width: 768px) {
          .game-detail { padding: 12px; }
          .hero-content { flex-direction: column; padding: 24px; }
          .hero-cover { width: 100%; height: 200px; }
          .hero-title { font-size: 24px; }
          .req-grid { grid-template-columns: 1fr; }
          .tab-btn { padding: 12px 16px; font-size: 13px; }
          .tab-content { padding: 20px; }
        }
      `}</style>
    </div>
  );
};

export default GamePage;
