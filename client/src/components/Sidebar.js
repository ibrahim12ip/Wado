import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiGrid, FiTrendingUp, FiStar, FiDownload,
  FiZap, FiGamepad, FiCompass, FiMonitor, FiGlobe,
  FiShield, FiDribbble, FiAward, FiUsers, FiMessageSquare
} from 'react-icons/fi';

const categories = [
  { name: 'FPS', icon: FiCrosshair, slug: 'fps' },
  { name: 'Korku', icon: FiMoon, slug: 'horror' },
  { name: 'Hayatta Kalma', icon: FiShield, slug: 'survival' },
  { name: 'Açık Dünya', icon: FiGlobe, slug: 'open-world' },
  { name: 'Simülasyon', icon: FiMonitor, slug: 'simulation' },
  { name: 'Yarış', icon: FiDribbble, slug: 'racing' },
  { name: 'RPG', icon: FiAward, slug: 'rpg' },
  { name: 'Online', icon: FiGlobe, slug: 'online' },
  { name: 'Battle Royale', icon: FiCrosshair, slug: 'battle-royale' },
  { name: 'Sandbox', icon: FiGrid, slug: 'sandbox' },
  { name: 'Indie', icon: FiStar, slug: 'indie' }
];

function FiCrosshair(props) { return <FiCompass {...props} />; }
function FiMoon(props) { return <FiZap {...props} />; }

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">W</div>
        <span className="logo-text">Wado</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">Ana Menü</span>
          <NavLink to="/" className="nav-item"><FiHome /> Ana Sayfa</NavLink>
          <NavLink to="/pc-oyunlari" className="nav-item"><FiMonitor /> PC Oyunları</NavLink>
          <NavLink to="/online-oyunlar" className="nav-item"><FiGlobe /> Online Oyunlar</NavLink>
          <NavLink to="/yeni-oyunlar" className="nav-item"><FiStar /> Yeni Oyunlar</NavLink>
          <NavLink to="/populer" className="nav-item"><FiTrendingUp /> Popülerler</NavLink>
          <NavLink to="/blog" className="nav-item"><FiMessageSquare /> Blog</NavLink>
        </div>

        <div className="nav-section">
          <span className="nav-section-title">Kategoriler</span>
          {categories.map((cat) => (
            <NavLink key={cat.slug} to={`/kategori/${cat.slug}`} className="nav-item">
              <cat.icon /> {cat.name}
            </NavLink>
          ))}
        </div>
      </nav>

      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          z-index: 100;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          height: var(--header-height);
        }
        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan));
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 20px;
          color: white;
        }
        .logo-text {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent-purple-light), var(--accent-cyan));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .sidebar-nav {
          padding: 12px 0;
          flex: 1;
        }
        .nav-section {
          margin-bottom: 8px;
        }
        .nav-section-title {
          display: block;
          padding: 8px 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          transition: var(--transition);
          position: relative;
          svg { font-size: 18px; flex-shrink: 0; }
          &:hover {
            color: var(--text-primary);
            background: var(--bg-hover);
          }
          &.active {
            color: var(--accent-purple-light);
            background: rgba(124, 58, 237, 0.1);
            &::before {
              content: '';
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 3px;
              height: 20px;
              background: var(--accent-purple);
              border-radius: 0 3px 3px 0;
            }
          }
        }
        @media (max-width: 768px) {
          .sidebar { display: none; }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
