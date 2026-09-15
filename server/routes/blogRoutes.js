import { Router } from 'express';
import {
  getAllBlogs,
  getAllBlogsAdmin,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/', getAllBlogs);
router.get('/admin', authenticate, requireAdmin, getAllBlogsAdmin);
router.get('/:id', getBlogById);
router.post('/', authenticate, requireAdmin, upload.single('image_file'), createBlog);
router.put('/:id', authenticate, requireAdmin, upload.single('image_file'), updateBlog);
router.delete('/:id', authenticate, requireAdmin, deleteBlog);

export default router;
