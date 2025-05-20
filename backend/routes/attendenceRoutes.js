import express from 'express';
import {
  createAttendance,
  getStudentAttendance,
  getDateAttendance,
  updateAttendance,
  deleteAttendance
} from '../controllers/attendanceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createAttendance);
router.get('/student/:studentId', protect, getStudentAttendance);
router.get('/date/:date', protect, getDateAttendance);
router.put('/:id', protect, admin, updateAttendance);
router.delete('/:id', protect, admin, deleteAttendance);

export default router;