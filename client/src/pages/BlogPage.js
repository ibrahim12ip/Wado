import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiEye, FiArrowRight } from 'react-icons/fi';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [blogsRes, featuredRes] = await Promise.all([
          fetch('/api/blogs?limit=12').then(r => r.json()),
          fetch('/api/blogs/featured').then(r => r.json())
        ]);
        setBlogs(blogsRes.blogs || []);
        if (featuredRes.length > 0) setFeatured(featuredRes[0]);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, []);

  const categoryLabels = { news: 'Haber', guide: 'Rehber', review: 'İnceleme', list: 'Liste', optimization: 'Optimizasyon' };
  const categoryColors = { news: '#7c3aed', guide: '#06b6d4', review: '#f59e0b', list: '#ec4899', optimization: '#10b981' };

  return (
    <div className="page-container">
      <div className="blog-page">
        <h1 className="blog-main-title">Blog</h1>
        <p className="blog-subtitle">Oyun haberleri, rehberler, incelemeler ve daha fazlası</p>

        {featured && (
          <Link to={`/blog/${featured.slug}`} className="featured-blog">
            <div className="featured-image" style={{ backgroundImage: `url(${featured.coverImage})` }} />
            <div className="featured-content">
              <span className="featured-badge" style={{ background: categoryColors[featured.category] }}>
                {categoryLabels[featured.category] || featured.category}
              </span>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt || featured.content?.substring(0, 150)}...</p>
              <div className="featured-meta">
                <span><FiCalendar /> {new Date(featured.createdAt).toLocaleDateString('tr-TR')}</span>
                <span><FiEye /> {featured.viewCount}</span>
              </div>
            </div>
          </Link>
        )}

        <div className="blog-grid">
          {blogs.map(blog => (
            <Link key={blog._id} to={`/blog/${blog.slug}`} className="blog-card">
              <div className="blog-card-img" style={{ backgroundImage: `url(${blog.coverImage})` }}>
                <span className="blog-cat-badge" style={{ background: categoryColors[blog.category] }}>
                  {categoryLabels[blog.category] || blog.category}
                </span>
              </div>
              <div className="blog-card-body">
                <h3>{blog.title}</h3>
                <p>{blog.excerpt || blog.content?.substring(0, 100)}...</p>
                <div className="blog-card-footer">
                  <span><FiCalendar /> {new Date(blog.createdAt).toLocaleDateString('tr-TR')}</span>
                  <span className="read-more">Devamı <FiArrowRight /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .blog-page { padding: 24px; max-width: 1200px; margin: 0 auto; }
        .blog-main-title { font-size: 32px; font-weight: 900; }
        .blog-subtitle { color: var(--text-secondary); margin-bottom: 32px; }
        .featured-blog {
          display: grid; grid-template-columns: 1fr 1fr;
          background: var(--bg-card); border-radius: var(--radius-lg);
          overflow: hidden; margin-bottom: 32px;
          border: 1px solid var(--border-color);
          transition: var(--transition);
          &:hover { border-color: var(--accent-purple); }
        }
        .featured-image { min-height: 300px; background-size: cover; background-position: center; }
        .featured-content { padding: 32px; display: flex; flex-direction: column; gap: 12px; justify-content: center; }
        .featured-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; color: white; width: fit-content; }
        .featured-content h2 { font-size: 24px; font-weight: 700; }
        .featured-content p { color: var(--text-secondary); line-height: 1.6; }
        .featured-meta { display: flex; gap: 16px; font-size: 13px; color: var(--text-muted); svg { margin-right: 4px; vertical-align: middle; } }
        .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .blog-card {
          background: var(--bg-card); border-radius: var(--radius-md);
          overflow: hidden; border: 1px solid var(--border-color);
          transition: var(--transition);
          &:hover { transform: translateY(-4px); border-color: var(--accent-purple); box-shadow: var(--neon-glow); }
        }
        .blog-card-img { height: 180px; background-size: cover; background-position: center; position: relative; }
        .blog-cat-badge {
          position: absolute; top: 12px; left: 12px;
          padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; color: white;
        }
        .blog-card-body { padding: 20px; }
        .blog-card-body h3 { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
        .blog-card-body p { font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px; }
        .blog-card-footer {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 12px; color: var(--text-muted);
          .read-more { display: flex; align-items: center; gap: 4px; color: var(--accent-purple-light); font-weight: 500; }
        }
        @media (max-width: 768px) {
          .blog-page { padding: 12px; }
          .featured-blog { grid-template-columns: 1fr; }
          .blog-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default BlogPage;
