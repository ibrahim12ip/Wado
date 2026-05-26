import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import GameManager from './components/GameManager';
import BlogManager from './components/BlogManager';
import ReviewManager from './components/ReviewManager';
import NewsManager from './components/NewsManager';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('wado_admin_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const mockUser = { username: 'admin', role: 'admin' };
    localStorage.setItem('wado_admin_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('wado_admin_user');
    setUser(null);
  };

  if (!user) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="admin-login-logo">
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2.5rem', fontWeight: 900, color: '#00d4ff', textShadow: '0 0 20px rgba(0,212,255,0.3)' }}>W</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>ado Admin</span>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Kullanıcı Adı</label>
              <input type="text" placeholder="admin" defaultValue="admin" />
            </div>
            <div className="form-group">
              <label>Şifre</label>
              <input type="password" placeholder="********" defaultValue="admin" />
            </div>
            <button type="submit" className="admin-btn add" style={{ width: '100%', padding: '0.8rem' }}>Giriş Yap</button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'games', label: 'Oyunlar', icon: 'fa-gamepad' },
    { id: 'blog', label: 'Blog', icon: 'fa-newspaper' },
    { id: 'reviews', label: 'İncelemeler', icon: 'fa-star' },
    { id: 'news', label: 'Haberler', icon: 'fa-bolt' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="logo-text" style={{ fontSize: '1.8rem' }}>W</span>
          <span className="logo-sub" style={{ fontSize: '1rem' }}>ado</span>
        </div>
        <h3>Yönetim</h3>
        {navItems.map(item => (
          <a key={item.id} href="#" className={`admin-nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActivePage(item.id); }}>
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </a>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <a href="#" className="admin-nav-item" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Çıkış Yap</span>
          </a>
        </div>
      </aside>
      <main className="admin-main">
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'games' && <GameManager />}
        {activePage === 'blog' && <BlogManager />}
        {activePage === 'reviews' && <ReviewManager />}
        {activePage === 'news' && <NewsManager />}
      </main>
    </div>
  );
}

export default App;
