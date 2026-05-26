import React from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiEye, FiStar } from 'react-icons/fi';

const GameCard = ({ game }) => {
  return (
    <Link to={`/oyun/${game.slug}`} className="game-card">
      <div className="card-image">
        <img src={game.coverImage || 'https://via.placeholder.com/300x170/1a1a2e/7c3aed?text=Wado'} alt={game.title} />
        <div className="card-overlay">
          <span className="card-quick-desc">{game.description?.substring(0, 80)}...</span>
          <div className="card-specs">
            {game.systemRequirements?.minimum?.memory && (
              <span className="spec-tag">{game.systemRequirements.minimum.memory} RAM</span>
            )}
            {game.size && <span className="spec-tag">{game.size}</span>}
          </div>
        </div>
        <div className="card-badges">
          {game.isFeatured && <span className="badge featured">Öne Çıkan</span>}
          {game.isLowSpec && <span className="badge lowspec">Düşük Sistem</span>}
          {game.isOnline && <span className="badge online">Online</span>}
        </div>
      </div>
      <div className="card-body">
        <h3 className="card-title">{game.title}</h3>
        <div className="card-meta">
          <span className="card-category">{game.category?.name || 'Genel'}</span>
          <div className="card-stats">
            <span><FiDownload /> {game.downloadCount || 0}</span>
            <span><FiEye /> {game.viewCount || 0}</span>
          </div>
        </div>
        <div className="card-footer">
          <div className="card-rating">
            <FiStar className="star-icon" />
            <span>{(game.rating || 0).toFixed(1)}</span>
          </div>
          <span className="card-download-btn">İndir</span>
        </div>
      </div>

      <style>{`
        .game-card {
          display: block;
          background: var(--bg-card);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: var(--transition);
          border: 1px solid var(--border-color);
          animation: fadeInUp 0.5s ease;
          &:hover {
            transform: translateY(-6px);
            border-color: var(--accent-purple);
            box-shadow: var(--neon-glow);
            .card-overlay { opacity: 1; }
            .card-image img { transform: scale(1.08); }
          }
        }
        .card-image {
          position: relative;
          overflow: hidden;
          aspect-ratio: 16/9;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }
        }
        .card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 16px;
          opacity: 0;
          transition: var(--transition);
          .card-quick-desc {
            font-size: 12px;
            color: var(--text-secondary);
            line-height: 1.4;
          }
          .card-specs {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
          }
          .spec-tag {
            background: rgba(124, 58, 237, 0.3);
            border: 1px solid rgba(124, 58, 237, 0.3);
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            color: var(--accent-purple-light);
          }
        }
        .card-badges {
          position: absolute;
          top: 8px;
          left: 8px;
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          .badge {
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            &.featured { background: var(--accent-purple); color: white; }
            &.lowspec { background: var(--accent-cyan); color: black; }
            &.online { background: var(--accent-pink); color: white; }
          }
        }
        .card-body { padding: 14px; }
        .card-title {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .card-category {
          font-size: 12px;
          color: var(--accent-purple-light);
          background: rgba(124, 58, 237, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .card-stats {
          display: flex;
          gap: 8px;
          font-size: 11px;
          color: var(--text-muted);
          svg { font-size: 12px; margin-right: 2px; vertical-align: middle; }
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
        }
        .card-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          color: var(--accent-cyan);
          .star-icon { color: #fbbf24; }
        }
        .card-download-btn {
          background: linear-gradient(135deg, var(--accent-purple), var(--accent-purple-dark));
          color: white;
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          transition: var(--transition);
          &:hover { box-shadow: var(--neon-glow); }
        }
      `}</style>
    </Link>
  );
};

export default GameCard;
