import express from 'express';
import {
  uploadMaterial,
  getMaterials,
  deleteMaterial,
  updateMaterial
} from '../controllers/materialController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post(
  '/',
  protect,
  upload.single('file'),
  uploadMaterial
);

router.get('/', protect, getMaterials);
router.delete('/:id', protect, deleteMaterial);
router.put('/:id', protect, updateMaterial);

export default router;