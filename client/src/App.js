import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import CategoryPage from './pages/CategoryPage';
import BlogPage from './pages/BlogPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import BrowsePage from './pages/BrowsePage';
import BlogDetailPage from './pages/BlogDetailPage';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => setUser(data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, border: '3px solid var(--border-color)',
            borderTopColor: 'var(--accent-purple)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ color: 'var(--text-secondary)' }}>Wado yükleniyor...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar />
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/oyun/:slug" element={<GamePage />} />
        <Route path="/kategori/:slug" element={<CategoryPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/pc-oyunlari" element={<BrowsePage />} />
        <Route path="/yeni-oyunlar" element={<BrowsePage />} />
        <Route path="/populer" element={<BrowsePage />} />
        <Route path="/dusuk-sistem" element={<BrowsePage />} />
        <Route path="/online-oyunlar" element={<BrowsePage />} />
        <Route path="/editor-secimi" element={<BrowsePage />} />
        <Route path="/arama" element={<SearchPage />} />
        <Route path="/giris" element={user ? <Navigate to="/" /> : <LoginPage onLogin={setUser} />} />
        <Route path="/kayit" element={user ? <Navigate to="/" /> : <RegisterPage onLogin={setUser} />} />
        <Route path="/profil" element={user ? <ProfilePage user={user} /> : <Navigate to="/giris" />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/" />} />
        <Route path="*" element={
          <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
            <h1 style={{ fontSize: 72, fontWeight: 900, color: 'var(--accent-purple)', textShadow: 'var(--neon-glow)' }}>404</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 18 }}>Sayfa bulunamadı</p>
            <a href="/" className="btn-primary">Ana Sayfaya Dön</a>
          </div>
        } />
      </Routes>

      <style>{`
        .app { min-height: 100vh; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default App;
