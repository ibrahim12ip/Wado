import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { FiGrid, FiArrowUp, FiClock, FiStar } from 'react-icons/fi';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [games, setGames] = useState([]);
  const [sort, setSort] = useState('new');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await fetch(`/api/categories/${slug}/games?page=${page}&limit=12&sort=${sort}`);
        const data = await res.json();
        setCategory(data.category);
        setGames(data.games);
        setTotal(data.total);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, [slug, page, sort]);

  return (
    <div className="page-container">
      <div className="category-page">
        <div className="category-header">
          <div className="cat-info">
            <h1><FiGrid /> {category?.name || 'Kategori'}</h1>
            <p>{category?.description || ''}</p>
            <span className="game-count">{total} oyun</span>
          </div>
          <div className="sort-bar">
            <button className={`sort-btn ${sort === 'new' ? 'active' : ''}`} onClick={() => setSort('new')}><FiClock /> Yeni</button>
            <button className={`sort-btn ${sort === 'popular' ? 'active' : ''}`} onClick={() => setSort('popular')}><FiArrowUp /> Popüler</button>
            <button className={`sort-btn ${sort === 'rating' ? 'active' : ''}`} onClick={() => setSort('rating')}><FiStar /> Puan</button>
          </div>
        </div>
        <div className="game-grid">
          {games.map(game => <GameCard key={game._id} game={game} />)}
        </div>
        {Math.ceil(total / 12) > 1 && (
          <div className="pagination">
            {Array.from({ length: Math.ceil(total / 12) }, (_, i) => (
              <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .category-page { padding: 24px; max-width: 1400px; margin: 0 auto; }
        .category-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 24px; flex-wrap: wrap; gap: 16px;
        }
        .cat-info h1 { font-size: 28px; font-weight: 800; display: flex; align-items: center; gap: 10px; }
        .cat-info p { color: var(--text-secondary); margin-top: 4px; }
        .game-count { display: inline-block; margin-top: 8px; font-size: 13px; color: var(--text-muted); background: var(--bg-card); padding: 4px 12px; border-radius: 20px; }
        .sort-bar { display: flex; gap: 8px; background: var(--bg-card); padding: 4px; border-radius: var(--radius-sm); }
        .sort-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500;
          color: var(--text-secondary); background: none; transition: var(--transition);
          &:hover { color: var(--text-primary); }
          &.active { background: var(--accent-purple); color: white; }
        }
        .pagination { display: flex; justify-content: center; gap: 8px; margin-top: 32px; }
        .page-btn {
          width: 40px; height: 40px; border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 500; background: var(--bg-card);
          color: var(--text-secondary); border: 1px solid var(--border-color);
          transition: var(--transition);
          &:hover { border-color: var(--accent-purple); }
          &.active { background: var(--accent-purple); color: white; border-color: var(--accent-purple); }
        }
        @media (max-width: 768px) {
          .category-page { padding: 12px; }
          .category-header { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;
