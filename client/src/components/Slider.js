import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const defaultSlides = [
  {
    title: 'Yeni Çıkan Oyunlar',
    subtitle: 'En yeni ve heyecan verici oyunları keşfedin',
    buttonText: 'Keşfet',
    link: '/yeni-oyunlar',
    bg: 'linear-gradient(135deg, #1a0533, #0a0a2e, #1a0533)',
    gradient: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))'
  },
  {
    title: 'En Çok İndirilenler',
    subtitle: 'Topluluğumuzun favori oyunları',
    buttonText: 'Görüntüle',
    link: '/populer',
    bg: 'linear-gradient(135deg, #0a0a2e, #1a0a1a, #0a0a2e)',
    gradient: 'linear-gradient(135deg, var(--accent-pink), var(--accent-purple))'
  },
  {
    title: 'Editörün Seçimi',
    subtitle: 'Ekibimizden en iyi oyun tavsiyeleri',
    buttonText: 'İncele',
    link: '/editor-secimi',
    bg: 'linear-gradient(135deg, #052e1a, #0a0a2e, #052e1a)',
    gradient: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))'
  }
];

const Slider = ({ slides = defaultSlides }) => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="hero-slider">
      {slides.map((slide, index) => (
        <div key={index} className={`slide ${index === current ? 'active' : ''}`} style={{ background: slide.bg }}>
          <div className="slide-content">
            <div className="slide-badge" style={{ background: slide.gradient }}>Öne Çıkan</div>
            <h2 className="slide-title">{slide.title}</h2>
            <p className="slide-subtitle">{slide.subtitle}</p>
            <Link to={slide.link} className="slide-btn" style={{ background: slide.gradient }}>
              {slide.buttonText}
            </Link>
          </div>
          <div className="slide-glow" style={{ background: slide.gradient }} />
        </div>
      ))}

      <button className="slider-nav prev" onClick={prev}><FiChevronLeft /></button>
      <button className="slider-nav next" onClick={next}><FiChevronRight /></button>

      <div className="slider-dots">
        {slides.map((_, i) => (
          <button key={i} className={`dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>

      <style>{`
        .hero-slider {
          position: relative;
          height: 420px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: 40px;
        }
        .slide {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          padding: 0 60px;
          opacity: 0;
          transition: opacity 0.8s ease, transform 0.8s ease;
          transform: scale(1.05);
          &.active { opacity: 1; transform: scale(1); }
        }
        .slide-content {
          position: relative;
          z-index: 2;
          max-width: 600px;
        }
        .slide-badge {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          margin-bottom: 16px;
        }
        .slide-title {
          font-size: 42px;
          font-weight: 900;
          margin-bottom: 12px;
          line-height: 1.15;
          text-shadow: 0 2px 20px rgba(0,0,0,0.5);
        }
        .slide-subtitle {
          font-size: 16px;
          color: var(--text-secondary);
          margin-bottom: 24px;
          line-height: 1.5;
        }
        .slide-btn {
          display: inline-block;
          padding: 14px 32px;
          border-radius: var(--radius-sm);
          color: white;
          font-weight: 700;
          font-size: 15px;
          transition: var(--transition);
          &:hover { transform: translateY(-2px); box-shadow: var(--neon-glow); }
        }
        .slide-glow {
          position: absolute;
          right: -100px;
          top: 50%;
          transform: translateY(-50%);
          width: 500px;
          height: 500px;
          border-radius: 50%;
          opacity: 0.15;
          filter: blur(100px);
        }
        .slider-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--bg-glass);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border-color);
          color: white;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          z-index: 3;
          &:hover { background: var(--accent-purple); border-color: var(--accent-purple); }
          &.prev { left: 16px; }
          &.next { right: 16px; }
        }
        .slider-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 3;
          .dot {
            width: 10px; height: 10px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.1);
            transition: var(--transition);
            &.active {
              background: var(--accent-purple);
              border-color: var(--accent-purple);
              width: 24px;
              border-radius: 5px;
            }
          }
        }
        @media (max-width: 768px) {
          .hero-slider { height: 300px; border-radius: var(--radius-md); }
          .slide { padding: 0 24px; }
          .slide-title { font-size: 26px; }
          .slide-subtitle { font-size: 14px; }
          .slider-nav { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Slider;
