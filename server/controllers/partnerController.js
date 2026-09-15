import uuidv4 from '../utils/id.js';
import db from '../models/database.js';

const VALID_CATEGORIES = ['bank', 'nbfc', 'hfc'];

const validateCategory = (category) => VALID_CATEGORIES.includes(category);

const resolveLogoUrl = (bodyLogoUrl, file) => {
  if (bodyLogoUrl && typeof bodyLogoUrl === 'string' && bodyLogoUrl.trim()) {
    return bodyLogoUrl.trim();
  }
  if (file) {
    return `/uploads/${file.filename}`;
  }
  return bodyLogoUrl || null;
};

export const getAllPartners = (req, res) => {
  try {
    const partners = db
      .prepare('SELECT * FROM partners WHERE is_active = 1 ORDER BY sort_order ASC')
      .all();

    return res.status(200).json({
      success: true,
      data: partners,
      message: 'Partners retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to retrieve partners.',
    });
  }
};

export const getAllPartnersAdmin = (req, res) => {
  try {
    const partners = db
      .prepare('SELECT * FROM partners ORDER BY sort_order ASC')
      .all();
    return res.status(200).json({
      success: true,
      data: partners,
      message: 'All partners retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, message: 'Failed to retrieve partners.' });
  }
};

export const getPartnerById = (req, res) => {
  try {
    const { id } = req.params;
    const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Partner not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: partner,
      message: 'Partner retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to retrieve partner.',
    });
  }
};

export const createPartner = (req, res) => {
  try {
    const { name, logo_url, website, category, sort_order = 0, is_active = 1 } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Name and category are required.',
      });
    }

    if (!validateCategory(category)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Category must be 'bank', 'nbfc', or 'hfc'.",
      });
    }

    const id = uuidv4();
    const now = new Date().toISOString();
    const finalLogoUrl = resolveLogoUrl(logo_url, req.file);

    db.prepare(`
      INSERT INTO partners (id, name, logo_url, website, category, is_active, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name.trim(),
      finalLogoUrl,
      website || null,
      category,
      is_active ? 1 : 0,
      parseInt(sort_order, 10) || 0,
      now,
      now
    );

    const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(id);

    return res.status(201).json({
      success: true,
      data: partner,
      message: 'Partner created successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to create partner.',
    });
  }
};

export const updatePartner = (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo_url, website, category, sort_order, is_active } = req.body;

    const existingPartner = db.prepare('SELECT * FROM partners WHERE id = ?').get(id);
    if (!existingPartner) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Partner not found.',
      });
    }

    const updates = [];
    const values = [];

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Name cannot be empty.',
        });
      }
      updates.push('name = ?');
      values.push(name.trim());
    }

    if (logo_url !== undefined || req.file) {
      updates.push('logo_url = ?');
      values.push(resolveLogoUrl(logo_url, req.file));
    }

    if (website !== undefined) {
      updates.push('website = ?');
      values.push(website || null);
    }

    if (category !== undefined) {
      if (!validateCategory(category)) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "Category must be 'bank', 'nbfc', or 'hfc'.",
        });
      }
      updates.push('category = ?');
      values.push(category);
    }

    if (sort_order !== undefined) {
      updates.push('sort_order = ?');
      values.push(parseInt(sort_order, 10) || 0);
    }

    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active ? 1 : 0);
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

    db.prepare(`UPDATE partners SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(id);

    return res.status(200).json({
      success: true,
      data: partner,
      message: 'Partner updated successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to update partner.',
    });
  }
};

export const deletePartner = (req, res) => {
  try {
    const { id } = req.params;

    const existingPartner = db.prepare('SELECT id FROM partners WHERE id = ?').get(id);
    if (!existingPartner) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Partner not found.',
      });
    }

    db.prepare('DELETE FROM partners WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      data: null,
      message: 'Partner deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to delete partner.',
    });
  }
};
