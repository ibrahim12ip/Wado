import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { FiSearch, FiSliders, FiX } from 'react-icons/fi';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({ category: '', isOnline: '', sort: 'new' });
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    const params = new URLSearchParams(searchParams);
    if (q) params.set('q', q);
    if (filters.category) params.set('category', filters.category);
    if (filters.isOnline) params.set('isOnline', filters.isOnline);
    if (filters.sort) params.set('sort', filters.sort);

    fetch(`/api/games/search?${params.toString()}`)
      .then(r => r.json())
      .then(data => { setResults(data.games || []); setTotal(data.total || 0); })
      .catch(console.error);
  }, [searchParams, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query);
    setSearchParams(params);
  };

  return (
    <div className="page-container">
      <div className="search-page">
        <form className="search-hero" onSubmit={handleSearch}>
          <h1>Arama</h1>
          <div className="search-input-wrapper">
            <FiSearch />
            <input type="text" placeholder="Oyun adı, tür, etiket..." value={query}
              onChange={e => setQuery(e.target.value)} />
            <button type="submit" className="btn-primary">Ara</button>
          </div>
        </form>

        <div className="search-toolbar">
          <span className="result-count">{total} sonuç bulundu</span>
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            <FiSliders /> Filtrele
          </button>
        </div>

        {showFilters && (
          <div className="filter-bar glass">
            <select value={filters.sort} onChange={e => setFilters({ ...filters, sort: e.target.value })}>
              <option value="new">En Yeni</option>
              <option value="popular">En Popüler</option>
              <option value="rating">En Yüksek Puan</option>
            </select>
            <select value={filters.isOnline} onChange={e => setFilters({ ...filters, isOnline: e.target.value })}>
              <option value="">Tümü</option>
              <option value="true">Online</option>
              <option value="false">Offline</option>
            </select>
            <button className="btn-ghost" onClick={() => setFilters({ category: '', isOnline: '', sort: 'new' })}>
              <FiX /> Temizle
            </button>
          </div>
        )}

        <div className="game-grid">
          {results.map(game => <GameCard key={game._id} game={game} />)}
        </div>

        {results.length === 0 && (
          <div className="no-results">
            <FiSearch size={48} />
            <h3>Sonuç bulunamadı</h3>
            <p>Farklı bir arama terimi dene</p>
          </div>
        )}
      </div>
      <style>{`
        .search-page { padding: 24px; max-width: 1400px; margin: 0 auto; }
        .search-hero { text-align: center; margin-bottom: 32px; h1 { font-size: 28px; font-weight: 800; margin-bottom: 16px; } }
        .search-input-wrapper { display: flex; align-items: center; gap: 12px; max-width: 600px; margin: 0 auto; background: var(--bg-card); padding: 4px 4px 4px 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); input { flex: 1; background: none; border: none; color: var(--text-primary); font-size: 15px; padding: 12px 0; } svg { color: var(--text-muted); font-size: 20px; flex-shrink: 0; } }
        .search-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .result-count { font-size: 14px; color: var(--text-secondary); }
        .filter-toggle { display: flex; align-items: center; gap: 6px; background: var(--bg-card); padding: 8px 16px; border-radius: var(--radius-sm); color: var(--text-secondary); font-size: 14px; border: 1px solid var(--border-color); transition: var(--transition); &:hover { border-color: var(--accent-purple); color: var(--text-primary); } }
        .filter-bar { display: flex; gap: 12px; padding: 16px; border-radius: var(--radius-md); margin-bottom: 24px; flex-wrap: wrap; select { background: var(--bg-secondary); color: var(--text-primary); padding: 8px 16px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 14px; } }
        .no-results { text-align: center; padding: 60px 20px; color: var(--text-muted); h3 { margin: 12px 0 4px; font-size: 18px; } p { font-size: 14px; } }
      `}</style>
    </div>
  );
};

export default SearchPage;
