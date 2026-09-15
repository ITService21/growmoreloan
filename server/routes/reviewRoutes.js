import { Router } from 'express';
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/', getAllReviews);
router.get('/:id', getReviewById);
router.post('/', authenticate, requireAdmin, upload.single('reviewer_image_file'), createReview);
router.put('/:id', authenticate, requireAdmin, upload.single('reviewer_image_file'), updateReview);
router.delete('/:id', authenticate, requireAdmin, deleteReview);

export default router;
