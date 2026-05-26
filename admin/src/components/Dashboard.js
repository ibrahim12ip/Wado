import React from 'react';

function Dashboard() {
  const stats = [
    { label: 'Toplam Oyun', value: '20', icon: 'fa-gamepad', color: '#00d4ff' },
    { label: 'Blog Yazısı', value: '6', icon: 'fa-newspaper', color: '#8b5cf6' },
    { label: 'İnceleme', value: '6', icon: 'fa-star', color: '#ffd600' },
    { label: 'Haber', value: '6', icon: 'fa-bolt', color: '#ff0080' },
    { label: 'Kullanıcı', value: '0', icon: 'fa-users', color: '#00e676' },
    { label: 'Toplam İndirme', value: '37.4K', icon: 'fa-download', color: '#00e676' },
    { label: 'Toplam Görüntülenme', value: '0', icon: 'fa-eye', color: '#ff6d00' },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>
        <i className="fas fa-chart-pie" style={{ color: '#00d4ff', marginRight: '10px' }}></i> Dashboard
      </h2>
      <div className="admin-stats">
        {stats.map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h4>{stat.label}</h4>
              <i className={`fas ${stat.icon}`} style={{ fontSize: '1.5rem', color: stat.color, opacity: 0.5 }}></i>
            </div>
            <div className="stat-number">{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--card-radius)', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, marginBottom: '1rem' }}>
          <i className="fas fa-rocket" style={{ color: '#00d4ff', marginRight: '8px' }}></i> Hızlı İşlemler
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="admin-btn add" onClick={() => window.location = '#games'}>
            <i className="fas fa-plus"></i> Yeni Oyun Ekle
          </button>
          <button className="admin-btn add" onClick={() => window.location = '#blog'}>
            <i className="fas fa-plus"></i> Blog Yazısı Ekle
          </button>
          <button className="admin-btn add" onClick={() => window.location = '#news'}>
            <i className="fas fa-plus"></i> Haber Ekle
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
