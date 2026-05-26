// Initialize Particles
document.addEventListener('DOMContentLoaded', () => {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#00d4ff' },
        shape: { type: 'circle' },
        opacity: { value: 0.3, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#00d4ff', opacity: 0.15, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: true, straight: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
        modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  }

  // Navbar hamburger
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // Search toggle
  const searchToggle = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  if (searchToggle && searchBar) {
    searchToggle.addEventListener('click', () => {
      searchBar.classList.toggle('active');
      if (searchBar.classList.contains('active')) {
        document.getElementById('searchInput').focus();
      }
    });
    document.addEventListener('click', (e) => {
      if (!searchBar.contains(e.target) && e.target !== searchToggle && !searchToggle.contains(e.target)) {
        searchBar.classList.remove('active');
      }
    });
  }

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      themeToggle.innerHTML = document.documentElement.dataset.theme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
  }

  // Scroll animations with GSAP
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.section').forEach(section => {
      gsap.from(section, {
        scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' },
        y: 50, opacity: 0, duration: 0.8, ease: 'power3.out'
      });
    });

    gsap.utils.toArray('.game-card, .news-card, .blog-card, .review-card, .category-card').forEach(card => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
        y: 30, opacity: 0, duration: 0.5, ease: 'power2.out'
      });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar');
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      lastScroll = currentScroll;
    });
  }

  // Mouse glow effect
  const glow = document.createElement('div');
  glow.className = 'mouse-glow';
  glow.style.cssText = 'position:fixed;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(0,212,255,0.06),transparent 70%);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:all 0.1s ease;';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
});
