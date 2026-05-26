import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiUser, FiMenu, FiLogOut, FiSettings } from 'react-icons/fi';

const Header = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/arama?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={() => setMobileMenu(!mobileMenu)}>
          <FiMenu />
        </button>
        <form className="search-bar" onSubmit={handleSearch}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Oyun ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="header-right">
        {user ? (
          <div className="user-menu" onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="user-avatar">
              {user.avatar ? <img src={user.avatar} alt="" /> : <FiUser />}
            </div>
            <span className="user-name">{user.username}</span>
            {showUserMenu && (
              <div className="user-dropdown">
                <Link to="/profil" className="dropdown-item"><FiUser /> Profil</Link>
                <Link to="/profil/ayarlar" className="dropdown-item"><FiSettings /> Ayarlar</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="dropdown-item"><FiSettings /> Admin Paneli</Link>
                )}
                <button onClick={onLogout} className="dropdown-item"><FiLogOut /> Çıkış</button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/giris" className="btn-ghost">Giriş</Link>
            <Link to="/kayit" className="btn-primary">Kayıt</Link>
          </div>
        )}
      </div>

      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: var(--sidebar-width);
          right: 0;
          height: var(--header-height);
          background: rgba(10, 10, 15, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 99;
        }
        .header-left { display: flex; align-items: center; gap: 16px; flex: 1; }
        .mobile-menu-btn {
          display: none;
          background: none;
          color: var(--text-primary);
          font-size: 22px;
          padding: 4px;
        }
        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 8px 16px;
          max-width: 400px;
          width: 100%;
          transition: var(--transition);
          &:focus-within {
            border-color: var(--accent-purple);
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
          }
          .search-icon { color: var(--text-muted); font-size: 18px; flex-shrink: 0; }
          input {
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 14px;
            width: 100%;
            &::placeholder { color: var(--text-muted); }
          }
        }
        .header-right { display: flex; align-items: center; gap: 12px; }
        .user-menu {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 4px;
          border-radius: var(--radius-sm);
          transition: var(--transition);
          &:hover { background: var(--bg-hover); }
        }
        .user-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--accent-purple);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          img { width: 100%; height: 100%; object-fit: cover; }
          svg { color: white; font-size: 16px; }
        }
        .user-name { font-size: 14px; font-weight: 500; color: var(--text-primary); }
        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          min-width: 200px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 8px;
          box-shadow: var(--shadow-lg);
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          font-size: 14px;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          transition: var(--transition);
          width: 100%;
          background: none;
          text-align: left;
          svg { font-size: 16px; }
          &:hover { background: var(--bg-hover); color: var(--text-primary); }
        }
        .auth-buttons { display: flex; gap: 8px; }
        @media (max-width: 768px) {
          .header { left: 0; padding: 0 12px; }
          .mobile-menu-btn { display: block; }
          .search-bar { max-width: 200px; }
          .user-name { display: none; }
        }
      `}</style>
    </header>
  );
};

export default Header;
