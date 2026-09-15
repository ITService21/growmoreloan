import db from '../models/database.js';

const parseBlogRow = (row) => ({
  ...row,
  content: JSON.parse(row.content || '[]'),
  tags: JSON.parse(row.tags || '[]'),
});

const stringifyField = (value, fallback = '[]') => {
  if (value === undefined || value === null) {
    return fallback;
  }
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value);
};

const resolveImageUrl = (bodyImageUrl, file) => {
  if (bodyImageUrl && typeof bodyImageUrl === 'string' && bodyImageUrl.trim()) {
    return bodyImageUrl.trim();
  }
  if (file) {
    return `/uploads/${file.filename}`;
  }
  return bodyImageUrl || null;
};

export const getAllBlogs = (req, res) => {
  try {
    const { category, page = 1, limit = 6, search } = req.query;
    let query = 'SELECT * FROM blogs WHERE is_published = 1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (title LIKE ? OR excerpt LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const { total } = db.prepare(countQuery).get(...params);

    query += ' ORDER BY date DESC';
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), offset);

    const blogs = db.prepare(query).all(...params);

    const parsed = blogs.map((b) => ({
      ...b,
      content: typeof b.content === 'string' ? JSON.parse(b.content) : b.content,
      tags: typeof b.tags === 'string' ? JSON.parse(b.tags) : (b.tags || []),
    }));

    return res.status(200).json({
      success: true,
      data: parsed,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)),
      },
      message: 'Blogs retrieved successfully.',
    });
  } catch (error) {
    console.error('getAllBlogs error:', error);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to retrieve blogs.',
    });
  }
};

export const getAllBlogsAdmin = (req, res) => {
  try {
    const blogs = db
      .prepare('SELECT * FROM blogs ORDER BY date DESC')
      .all()
      .map(parseBlogRow);

    return res.status(200).json({
      success: true,
      data: blogs,
      message: 'All blogs retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to retrieve blogs.',
    });
  }
};

export const getBlogById = (req, res) => {
  try {
    const { id } = req.params;
    const blog = db.prepare('SELECT * FROM blogs WHERE id = ? AND is_published = 1').get(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Blog not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: parseBlogRow(blog),
      message: 'Blog retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to retrieve blog.',
    });
  }
};

export const createBlog = (req, res) => {
  try {
    const {
      id,
      title,
      category,
      category_name,
      excerpt,
      image_url,
      date,
      read_time = '5 min read',
      content,
      tags,
      seo_title,
      seo_description,
      is_published = 1,
    } = req.body;

    if (!id || !title || !category || !category_name || !date || !content) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'id, title, category, category_name, date, and content are required.',
      });
    }

    const existingBlog = db.prepare('SELECT id FROM blogs WHERE id = ?').get(id);
    if (existingBlog) {
      return res.status(409).json({
        success: false,
        data: null,
        message: 'A blog with this id already exists.',
      });
    }

    const now = new Date().toISOString();
    const finalImageUrl = resolveImageUrl(image_url, req.file);

    db.prepare(`
      INSERT INTO blogs (
        id, title, category, category_name, excerpt, image_url, date, read_time,
        content, tags, seo_title, seo_description, is_published, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id.trim(),
      title.trim(),
      category.trim(),
      category_name.trim(),
      excerpt?.trim() || null,
      finalImageUrl,
      date.trim(),
      read_time.trim(),
      stringifyField(content, '[]'),
      stringifyField(tags, '[]'),
      seo_title?.trim() || null,
      seo_description?.trim() || null,
      is_published ? 1 : 0,
      now,
      now
    );

    const blog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(id);

    return res.status(201).json({
      success: true,
      data: parseBlogRow(blog),
      message: 'Blog created successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to create blog.',
    });
  }
};

export const updateBlog = (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      category_name,
      excerpt,
      image_url,
      date,
      read_time,
      content,
      tags,
      seo_title,
      seo_description,
      is_published,
    } = req.body;

    const existingBlog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(id);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Blog not found.',
      });
    }

    const updates = [];
    const values = [];

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Title cannot be empty.',
        });
      }
      updates.push('title = ?');
      values.push(title.trim());
    }

    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category.trim());
    }

    if (category_name !== undefined) {
      updates.push('category_name = ?');
      values.push(category_name.trim());
    }

    if (excerpt !== undefined) {
      updates.push('excerpt = ?');
      values.push(excerpt?.trim() || null);
    }

    if (image_url !== undefined || req.file) {
      updates.push('image_url = ?');
      values.push(resolveImageUrl(image_url, req.file));
    }

    if (date !== undefined) {
      updates.push('date = ?');
      values.push(date.trim());
    }

    if (read_time !== undefined) {
      updates.push('read_time = ?');
      values.push(read_time.trim());
    }

    if (content !== undefined) {
      updates.push('content = ?');
      values.push(stringifyField(content, '[]'));
    }

    if (tags !== undefined) {
      updates.push('tags = ?');
      values.push(stringifyField(tags, '[]'));
    }

    if (seo_title !== undefined) {
      updates.push('seo_title = ?');
      values.push(seo_title?.trim() || null);
    }

    if (seo_description !== undefined) {
      updates.push('seo_description = ?');
      values.push(seo_description?.trim() || null);
    }

    if (is_published !== undefined) {
      updates.push('is_published = ?');
      values.push(is_published ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'No valid fields provided for update.',
      });
    }

    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    db.prepare(`UPDATE blogs SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const blog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(id);

    return res.status(200).json({
      success: true,
      data: parseBlogRow(blog),
      message: 'Blog updated successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to update blog.',
    });
  }
};

export const deleteBlog = (req, res) => {
  try {
    const { id } = req.params;

    const existingBlog = db.prepare('SELECT id FROM blogs WHERE id = ?').get(id);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Blog not found.',
      });
    }

    db.prepare('DELETE FROM blogs WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      data: null,
      message: 'Blog deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to delete blog.',
    });
  }
};
