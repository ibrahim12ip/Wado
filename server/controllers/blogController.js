const Blog = require('../models/Blog');

exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    const blogs = await Blog.find(filter)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(filter);
    res.json({ blogs, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Bloglar getirilemedi' });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isActive: true })
      .populate('author', 'username avatar');
    if (!blog) return res.status(404).json({ message: 'Blog bulunamadı' });
    blog.viewCount += 1;
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Blog getirilemedi' });
  }
};

exports.getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isFeatured: true, isActive: true })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Öne çıkan bloglar getirilemedi' });
  }
};
