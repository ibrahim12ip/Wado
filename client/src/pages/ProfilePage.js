import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiCalendar, FiHeart, FiStar, FiAward } from 'react-icons/fi';

const ProfilePage = ({ user: propUser }) => {
  const [profile, setProfile] = useState(propUser);

  useEffect(() => {
    if (!profile) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(r => r.json()).then(setProfile).catch(console.error);
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="page-container">
        <div className="loading" style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
          Profil yükleniyor...
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.avatar ? <img src={profile.avatar} alt="" /> : <FiUser />}
          </div>
          <div className="profile-info">
            <h1>{profile.username}</h1>
            <p className="profile-email"><FiMail /> {profile.email}</p>
            <p className="profile-joined"><FiCalendar /> Katılma: {new Date(profile.createdAt).toLocaleDateString('tr-TR')}</p>
            <div className="profile-role">
              <span className={`role-badge ${profile.role}`}>{profile.role === 'admin' ? 'Admin' : profile.role === 'mod' ? 'Moderatör' : 'Üye'}</span>
            </div>
          </div>
          {profile.badges?.length > 0 && (
            <div className="profile-badges">
              <h3><FiAward /> Rozetler</h3>
              <div className="badge-list">
                {profile.badges.map((badge, i) => (
                  <span key={i} className="badge-item">{badge}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="profile-stats">
          <div className="stat-card"><FiHeart /> <strong>{profile.favorites?.length || 0}</strong> Favori</div>
          <div className="stat-card"><FiStar /> <strong>{profile.gameRatings?.length || 0}</strong> Puanlama</div>
          <div className="stat-card"><FiAward /> <strong>{profile.badges?.length || 0}</strong> Rozet</div>
        </div>

        {profile.bio && (
          <div className="profile-bio">
            <h3>Hakkımda</h3>
            <p>{profile.bio}</p>
          </div>
        )}
      </div>

      <style>{`
        .profile-page { padding: 24px; max-width: 1000px; margin: 0 auto; }
        .profile-header { display: flex; gap: 24px; align-items: center; background: var(--bg-card); padding: 32px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); margin-bottom: 24px; flex-wrap: wrap; }
        .profile-avatar { width: 96px; height: 96px; border-radius: 50%; background: var(--accent-purple); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; img { width: 100%; height: 100%; object-fit: cover; } svg { font-size: 36px; color: white; } }
        .profile-info { flex: 1; h1 { font-size: 24px; font-weight: 700; } p { display: flex; align-items: center; gap: 6px; color: var(--text-secondary); font-size: 14px; margin-top: 4px; } }
        .role-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; margin-top: 8px; &.admin { background: rgba(124,58,237,0.2); color: var(--accent-purple-light); } &.mod { background: rgba(6,182,212,0.2); color: var(--accent-cyan); } &.user { background: rgba(160,160,184,0.15); color: var(--text-secondary); } }
        .profile-badges { width: 100%; h3 { font-size: 14px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; } }
        .badge-list { display: flex; gap: 6px; flex-wrap: wrap; }
        .badge-item { background: var(--bg-hover); padding: 4px 12px; border-radius: 20px; font-size: 12px; border: 1px solid var(--border-color); }
        .profile-stats { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .stat-card { flex: 1; min-width: 120px; background: var(--bg-card); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-secondary); svg { color: var(--accent-purple-light); font-size: 20px; } strong { color: var(--text-primary); font-size: 18px; } }
        .profile-bio { background: var(--bg-card); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color); h3 { font-size: 16px; margin-bottom: 8px; } p { color: var(--text-secondary); line-height: 1.6; } }
      `}</style>
    </div>
  );
};

export default ProfilePage;
