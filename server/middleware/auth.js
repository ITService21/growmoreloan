import jwt from 'jsonwebtoken';
import db from '../models/database.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Access denied. Invalid token format.',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          data: null,
          message: 'Token expired. Please login again.',
        });
      }
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid token.',
      });
    }

    const user = db
      .prepare('SELECT id, phone, name, role, created_at, updated_at FROM users WHERE id = ?')
      .get(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'User not found. Token may be invalid.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Authentication failed.',
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      data: null,
      message: 'Access denied. Admin privileges required.',
    });
  }
  next();
};
