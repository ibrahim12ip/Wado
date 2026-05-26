import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiStar, FiZap, FiDownload, FiArrowRight } from 'react-icons/fi';
import Slider from '../components/Slider';
import GameCard from '../components/GameCard';

const HomePage = () => {
  const [games, setGames] = useState({
    featured: [], trending: [], newReleases: [], lowSpec: [], editorPicks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const base = '/api/games';
        const [featuredRes, trendingRes, newRes, lowSpecRes, editorRes] = await Promise.all([
          fetch(`${base}/featured`).then(r => r.json()),
          fetch(`${base}/trending`).then(r => r.json()),
          fetch(`${base}?sort=new&limit=8`).then(r => r.json()),
          fetch(`${base}/low-spec`).then(r => r.json()),
          fetch(`${base}/editor-picks`).then(r => r.json())
        ]);
        setGames({
          featured: featuredRes,
          trending: trendingRes,
          newReleases: newRes.games || newRes,
          lowSpec: lowSpecRes,
          editorPicks: editorRes
        });
      } catch (err) {
        console.error('Oyunlar yüklenemedi:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const sections = [
    { title: 'Son Eklenen Oyunlar', icon: FiZap, games: games.newReleases, link: '/yeni-oyunlar' },
    { title: 'Trend Oyunlar', icon: FiTrendingUp, games: games.trending, link: '/populer' },
    { title: 'Düşük Sistem Oyunları', icon: FiDownload, games: games.lowSpec, link: '/dusuk-sistem' },
    { title: 'Editörün Seçimi', icon: FiStar, games: games.editorPicks, link: '/editor-secimi' }
  ];

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Oyunlar yükleniyor...</p>
        </div>
        <style>{`
          .loading-spinner {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; min-height: 60vh; gap: 16px;
          }
          .spinner {
            width: 48px; height: 48px;
            border: 3px solid var(--border-color);
            border-top-color: var(--accent-purple);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="container">
          <Slider />
          <GameSections sections={sections} />
        </div>
      </main>

      <style>{`
        .main-content { padding: 24px; }
        .container { max-width: 1400px; margin: 0 auto; }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .section-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: var(--accent-purple-light);
          font-weight: 500;
          transition: var(--transition);
          &:hover { gap: 10px; }
        }
        @media (max-width: 768px) {
          .main-content { padding: 12px; }
        }
      `}</style>
    </div>
  );
};

const GameSections = ({ sections }) => {
  return sections.map((section, idx) => {
    if (!section.games || section.games.length === 0) return null;
    const Icon = section.icon;
    return (
      <div key={idx} style={{ marginBottom: 40 }}>
        <div className="section-header">
          <h2 className="section-title">
            <Icon style={{ color: 'var(--accent-purple-light)' }} />
            {section.title}
            <span className="title-line" />
          </h2>
          <Link to={section.link} className="section-link">
            Tümünü Gör <FiArrowRight />
          </Link>
        </div>
        <div className="game-grid">
          {section.games.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      </div>
    );
  });
};

export default HomePage;
