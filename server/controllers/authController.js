import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/database.js';

const sanitizeUser = (user) => ({
  id: user.id,
  phone: user.phone,
  name: user.name,
  role: user.role,
  created_at: user.created_at,
  updated_at: user.updated_at,
});

export const login = (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Phone and password are required.',
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

    const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phoneStr);

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid phone or password.',
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid phone or password.',
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: sanitizeUser(user),
      },
      message: 'Login successful.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Login failed.',
    });
  }
};

export const getProfile = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
      message: 'Profile retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to retrieve profile.',
    });
  }
};
