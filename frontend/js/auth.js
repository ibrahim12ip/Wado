document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  const tabs = document.querySelectorAll('.profile-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(`tab-${tabName}`).classList.add('active');
    });
  });

  // Switch between login/register
  const switchToRegister = document.getElementById('switchToRegister');
  const switchToLogin = document.getElementById('switchToLogin');
  if (switchToRegister) switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.profile-tab')[1].click();
  });
  if (switchToLogin) switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.profile-tab')[0].click();
  });

  // Form handling
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;

      if (email && password) {
        const users = JSON.parse(localStorage.getItem('wado_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('wado_current_user', JSON.stringify(user));
          showToast('Başarıyla giriş yapıldı!', 'success');
          setTimeout(() => window.location.href = 'profile.html', 1000);
        } else {
          showToast('E-posta veya şifre hatalı!', 'error');
        }
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = registerForm.querySelector('input[type="text"]').value;
      const email = registerForm.querySelector('input[type="email"]').value;
      const password = registerForm.querySelector('input[type="password"]').value;

      if (username && email && password) {
        const users = JSON.parse(localStorage.getItem('wado_users') || '[]');
        if (users.find(u => u.email === email)) {
          showToast('Bu e-posta zaten kayıtlı!', 'error');
          return;
        }
        const newUser = { id: Date.now(), username, email, password, avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`, favorites: [], createdAt: new Date().toISOString() };
        users.push(newUser);
        localStorage.setItem('wado_users', JSON.stringify(users));
        localStorage.setItem('wado_current_user', JSON.stringify(newUser));
        showToast('Kayıt başarılı!', 'success');
        setTimeout(() => window.location.href = 'profile.html', 1000);
      }
    });
  }

  // Check logged in user
  const currentUser = JSON.parse(localStorage.getItem('wado_current_user') || 'null');
  if (currentUser) {
    document.querySelectorAll('.auth-btn').forEach(btn => {
      btn.innerHTML = `<i class="fas fa-user"></i> <span>${currentUser.username}</span>`;
      btn.href = 'profile.html';
    });
  }
});

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;top:80px;right:20px;padding:1rem 1.5rem;border-radius:10px;
    background:${type === 'success' ? 'linear-gradient(135deg,#00e676,#00c853)' : 'linear-gradient(135deg,#ff1744,#d50000)'};
    color:#000;font-weight:600;z-index:10000;box-shadow:0 10px 30px rgba(0,0,0,0.3);
    animation:slideIn 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100px)'; toast.style.transition = 'all 0.3s ease'; setTimeout(() => toast.remove(), 300); }, 3000);
}

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .empty-state { text-align: center; padding: 4rem 2rem; grid-column: 1/-1; }
  .empty-state i { font-size: 3rem; color: var(--neon-blue-dim); margin-bottom: 1rem; }
  .empty-state p { color: var(--text-secondary); font-size: 1.1rem; }
  .mouse-glow { display: none; }
  @media (hover: hover) { .mouse-glow { display: block; } }
`;
document.head.appendChild(style);
