import bcrypt from 'bcryptjs';
import uuidv4 from '../utils/id.js';
import db from '../models/database.js';

const validateRole = (role) => ['admin', 'user'].includes(role);

export const getAllUsers = (req, res) => {
  try {
    const users = db
      .prepare('SELECT id, phone, name, role, created_at, updated_at FROM users ORDER BY created_at DESC')
      .all();

    return res.status(200).json({
      success: true,
      data: users,
      message: 'Users retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to retrieve users.',
    });
  }
};

export const createUser = (req, res) => {
  try {
    const { phone, password, name, role = 'user' } = req.body;

    if (!phone || !password || !name) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Phone, password, and name are required.',
      });
    }

    const phoneStr = String(phone).trim();
    if (!/^\d{10}$/.test(phoneStr)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Phone must be a valid 10-digit number.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Password must be at least 6 characters.',
      });
    }

    if (!validateRole(role)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Role must be either 'admin' or 'user'.",
      });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE phone = ?').get(phoneStr);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        data: null,
        message: 'A user with this phone number already exists.',
      });
    }

    const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
    const hashedPassword = bcrypt.hashSync(password, bcryptRounds);
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, phone, password, name, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, phoneStr, hashedPassword, name.trim(), role, now, now);

    const user = db
      .prepare('SELECT id, phone, name, role, created_at, updated_at FROM users WHERE id = ?')
      .get(id);

    return res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to create user.',
    });
  }
};

export const updateUser = (req, res) => {
  try {
    const { id } = req.params;
    const { phone, password, name, role } = req.body;

    const existingUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'User not found.',
      });
    }

    const updates = [];
    const values = [];

    if (phone !== undefined) {
      const phoneStr = String(phone).trim();
      if (!/^\d{10}$/.test(phoneStr)) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Phone must be a valid 10-digit number.',
        });
      }
      const phoneTaken = db
        .prepare('SELECT id FROM users WHERE phone = ? AND id != ?')
        .get(phoneStr, id);
      if (phoneTaken) {
        return res.status(409).json({
          success: false,
          data: null,
          message: 'A user with this phone number already exists.',
        });
      }
      updates.push('phone = ?');
      values.push(phoneStr);
    }

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

    if (role !== undefined) {
      if (!validateRole(role)) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "Role must be either 'admin' or 'user'.",
        });
      }
      updates.push('role = ?');
      values.push(role);
    }

    if (password !== undefined) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Password must be at least 6 characters.',
        });
      }
      const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
      updates.push('password = ?');
      values.push(bcrypt.hashSync(password, bcryptRounds));
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

    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const user = db
      .prepare('SELECT id, phone, name, role, created_at, updated_at FROM users WHERE id = ?')
      .get(id);

    return res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to update user.',
    });
  }
};

export const deleteUser = (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'You cannot delete your own account.',
      });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'User not found.',
      });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      data: null,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to delete user.',
    });
  }
};
