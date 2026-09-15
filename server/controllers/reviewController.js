import uuidv4 from '../utils/id.js';
import db from '../models/database.js';

const validateRating = (rating) => {
  const num = parseInt(rating, 10);
  return !isNaN(num) && num >= 1 && num <= 5;
};

const resolveReviewerImage = (bodyImage, file) => {
  if (bodyImage && typeof bodyImage === 'string' && bodyImage.trim()) {
    return bodyImage.trim();
  }
  if (file) {
    return `/uploads/${file.filename}`;
  }
  return bodyImage || null;
};

export const getAllReviews = (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const { total } = db.prepare('SELECT COUNT(*) as total FROM reviews').get();
    const reviews = db
      .prepare('SELECT * FROM reviews ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(parseInt(limit, 10), offset);

    return res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)),
      },
      message: 'Reviews retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to retrieve reviews.',
    });
  }
};

export const getReviewById = (req, res) => {
  try {
    const { id } = req.params;
    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Review not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: review,
      message: 'Review retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to retrieve review.',
    });
  }
};

export const createReview = (req, res) => {
  try {
    const { reviewer_name, reviewer_image, rating, location, description } = req.body;

    if (!reviewer_name || rating === undefined) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Reviewer name and rating are required.',
      });
    }

    if (!validateRating(rating)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Rating must be an integer between 1 and 5.',
      });
    }

    const id = uuidv4();
    const now = new Date().toISOString();
    const finalReviewerImage = resolveReviewerImage(reviewer_image, req.file);

    db.prepare(`
      INSERT INTO reviews (id, reviewer_name, reviewer_image, rating, location, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      reviewer_name.trim(),
      finalReviewerImage,
      parseInt(rating, 10),
      location?.trim() || null,
      description?.trim() || null,
      now,
      now
    );

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);

    return res.status(201).json({
      success: true,
      data: review,
      message: 'Review created successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to create review.',
    });
  }
};

export const updateReview = (req, res) => {
  try {
    const { id } = req.params;
    const { reviewer_name, reviewer_image, rating, location, description } = req.body;

    const existingReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    if (!existingReview) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Review not found.',
      });
    }

    const updates = [];
    const values = [];

    if (reviewer_name !== undefined) {
      if (!reviewer_name.trim()) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Reviewer name cannot be empty.',
        });
      }
      updates.push('reviewer_name = ?');
      values.push(reviewer_name.trim());
    }

    if (reviewer_image !== undefined || req.file) {
      updates.push('reviewer_image = ?');
      values.push(resolveReviewerImage(reviewer_image, req.file));
    }

    if (rating !== undefined) {
      if (!validateRating(rating)) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Rating must be an integer between 1 and 5.',
        });
      }
      updates.push('rating = ?');
      values.push(parseInt(rating, 10));
    }

    if (location !== undefined) {
      updates.push('location = ?');
      values.push(location?.trim() || null);
    }

    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description?.trim() || null);
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

    db.prepare(`UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);

    return res.status(200).json({
      success: true,
      data: review,
      message: 'Review updated successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to update review.',
    });
  }
};

export const deleteReview = (req, res) => {
  try {
    const { id } = req.params;

    const existingReview = db.prepare('SELECT id FROM reviews WHERE id = ?').get(id);
    if (!existingReview) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Review not found.',
      });
    }

    db.prepare('DELETE FROM reviews WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      data: null,
      message: 'Review deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to delete review.',
    });
  }
};
