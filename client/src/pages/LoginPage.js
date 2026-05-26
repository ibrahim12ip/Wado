import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const LoginPage = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('token', data.token);
      onLogin(data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">W</div>
            <h1>Hoş Geldin</h1>
            <p>Wado hesabına giriş yap</p>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label><FiMail /> Email</label>
              <input type="email" placeholder="ornek@email.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label><FiLock /> Şifre</label>
              <div className="password-input">
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" required
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
          <p className="auth-switch">Hesabın yok mu? <Link to="/kayit">Kayıt Ol</Link></p>
        </div>
      </div>
      <style>{`
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .auth-card { width: 100%; max-width: 420px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 40px; }
        .auth-header { text-align: center; margin-bottom: 32px; }
        .auth-logo { width: 64px; height: 64px; background: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan)); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; color: white; margin: 0 auto 16px; }
        .auth-header h1 { font-size: 24px; font-weight: 700; }
        .auth-header p { color: var(--text-secondary); margin-top: 4px; }
        .auth-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; padding: 12px; border-radius: var(--radius-sm); font-size: 14px; margin-bottom: 16px; text-align: center; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: var(--text-secondary); }
        .form-group input, .form-group select, .form-group textarea {
          width: 100%; padding: 12px 16px; background: var(--bg-secondary);
          border: 1px solid var(--border-color); border-radius: var(--radius-sm);
          color: var(--text-primary); font-size: 14px;
          transition: var(--transition);
          &:focus { border-color: var(--accent-purple); box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
        }
        .form-group textarea { resize: vertical; min-height: 100px; }
        .password-input { position: relative; input { padding-right: 44px; } }
        .toggle-password { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; color: var(--text-muted); font-size: 18px; padding: 4px; }
        .auth-btn {
          width: 100%; padding: 14px; background: linear-gradient(135deg, var(--accent-purple), var(--accent-purple-dark));
          color: white; border-radius: var(--radius-sm); font-size: 15px; font-weight: 700;
          transition: var(--transition);
          &:hover { box-shadow: var(--neon-glow); }
          &:disabled { opacity: 0.6; cursor: not-allowed; }
        }
        .auth-switch { text-align: center; margin-top: 20px; font-size: 14px; color: var(--text-secondary); a { color: var(--accent-purple-light); font-weight: 600; &:hover { text-decoration: underline; } } }
      `}</style>
    </div>
  );
};

export default LoginPage;
