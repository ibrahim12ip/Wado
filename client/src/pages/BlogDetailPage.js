import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiEye, FiArrowLeft } from 'react-icons/fi';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then(r => r.json())
      .then(setBlog)
      .catch(console.error);
  }, [slug]);

  if (!blog) {
    return (
      <div className="page-container">
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Blog yükleniyor...</div>
      </div>
    );
  }

  const categoryLabels = { news: 'Haber', guide: 'Rehber', review: 'İnceleme', list: 'Liste', optimization: 'Optimizasyon' };
  const categoryColors = { news: '#7c3aed', guide: '#06b6d4', review: '#f59e0b', list: '#ec4899', optimization: '#10b981' };

  return (
    <div className="page-container">
      <div className="blog-detail">
        <Link to="/blog" className="back-link"><FiArrowLeft /> Blog'a Dön</Link>
        <div className="blog-detail-header">
          <span className="blog-cat" style={{ background: categoryColors[blog.category] }}>
            {categoryLabels[blog.category] || blog.category}
          </span>
          <h1>{blog.title}</h1>
          <div className="blog-detail-meta">
            <span><FiUser /> {blog.author?.username || 'Admin'}</span>
            <span><FiCalendar /> {new Date(blog.createdAt).toLocaleDateString('tr-TR')}</span>
            <span><FiEye /> {blog.viewCount} görüntülenme</span>
          </div>
        </div>
        {blog.coverImage && (
          <div className="blog-detail-image">
            <img src={blog.coverImage} alt={blog.title} />
          </div>
        )}
        <div className="blog-detail-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
        {blog.tags?.length > 0 && (
          <div className="blog-tags">
            {blog.tags.map(tag => <span key={tag} className="blog-tag">#{tag}</span>)}
          </div>
        )}
      </div>
      <style>{`
        .blog-detail { padding: 24px; max-width: 800px; margin: 0 auto; }
        .back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--text-secondary); font-size: 14px; margin-bottom: 24px; transition: var(--transition); &:hover { color: var(--accent-purple-light); } }
        .blog-detail-header { margin-bottom: 24px; }
        .blog-cat { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; color: white; margin-bottom: 12px; }
        .blog-detail-header h1 { font-size: 32px; font-weight: 800; line-height: 1.2; margin-bottom: 12px; }
        .blog-detail-meta { display: flex; gap: 20px; font-size: 14px; color: var(--text-secondary); svg { margin-right: 4px; vertical-align: middle; } }
        .blog-detail-image { margin-bottom: 24px; img { width: 100%; max-height: 400px; object-fit: cover; border-radius: var(--radius-md); } }
        .blog-detail-content { font-size: 16px; line-height: 1.8; color: var(--text-secondary); p { margin-bottom: 16px; } h2, h3 { color: var(--text-primary); margin: 24px 0 12px; } img { max-width: 100%; border-radius: var(--radius-sm); } ul, ol { padding-left: 20px; margin-bottom: 16px; } li { margin-bottom: 8px; } a { color: var(--accent-purple-light); &:hover { text-decoration: underline; } } blockquote { border-left: 3px solid var(--accent-purple); padding-left: 16px; margin: 16px 0; color: var(--text-muted); font-style: italic; } }
        .blog-tags { display: flex; gap: 8px; margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--border-color); }
        .blog-tag { font-size: 13px; color: var(--accent-purple-light); background: rgba(124,58,237,0.1); padding: 4px 12px; border-radius: 20px; }
        @media (max-width: 768px) { .blog-detail { padding: 12px; } .blog-detail-header h1 { font-size: 24px; } .blog-detail-meta { flex-wrap: wrap; gap: 12px; } }
      `}</style>
    </div>
  );
};

export default BlogDetailPage;
