import { Router } from 'express';
import {
  getAllPartners,
  getAllPartnersAdmin,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
} from '../controllers/partnerController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/', getAllPartners);
router.get('/admin', authenticate, requireAdmin, getAllPartnersAdmin);
router.get('/:id', getPartnerById);
router.post('/', authenticate, requireAdmin, upload.single('logo_file'), createPartner);
router.put('/:id', authenticate, requireAdmin, upload.single('logo_file'), updatePartner);
router.delete('/:id', authenticate, requireAdmin, deletePartner);

export default router;
