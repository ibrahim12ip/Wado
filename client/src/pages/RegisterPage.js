import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

const RegisterPage = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Şifreler eşleşmiyor');
    if (form.password.length < 6) return setError('Şifre en az 6 karakter olmalı');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password })
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
            <h1>Hesap Oluştur</h1>
            <p>Wado'ya katılmak için kayıt ol</p>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label><FiUser /> Kullanıcı Adı</label>
              <input type="text" placeholder="kullaniciadi" required
                value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
            </div>
            <div className="form-group">
              <label><FiMail /> Email</label>
              <input type="email" placeholder="ornek@email.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label><FiLock /> Şifre</label>
              <input type="password" placeholder="En az 6 karakter" required minLength={6}
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="form-group">
              <label><FiLock /> Şifre Tekrar</label>
              <input type="password" placeholder="Şifrenizi tekrar girin" required
                value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </button>
          </form>
          <p className="auth-switch">Zaten hesabın var mı? <Link to="/giris">Giriş Yap</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
