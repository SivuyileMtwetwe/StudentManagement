import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

// @desc    Create attendance record
// @route   POST /api/attendance
// @access  Private
export const createAttendance = async (req, res) => {
  try {
    const { studentId, date, status, remarks } = req.body;
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const attendance = new Attendance({
      student: studentId,
      date: new Date(date),
      status,
      remarks,
      recordedBy: req.user.id
    });

    const savedAttendance = await attendance.save();
    
    res.status(201).json({
      success: true,
      data: await Attendance.findById(savedAttendance._id)
        .populate('student', 'name class')
        .populate('recordedBy', 'username')
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get attendance by student
// @route   GET /api/attendance/student/:studentId
// @access  Private
export const getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.params.studentId })
      .populate('student', 'name class')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get attendance by date
// @route   GET /api/attendance/date/:date
// @access  Private
export const getDateAttendance = async (req, res) => {
  try {
    const startDate = new Date(req.params.date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(req.params.date);
    endDate.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    })
    .populate('student', 'name class')
    .populate('recordedBy', 'username');

    res.json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private/Admin
export const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('student', 'name class')
    .populate('recordedBy', 'username');

    if (!attendance) {
      return res.status(404).json({ success: false, error: 'Attendance record not found' });
    }

    res.json({ success: true, data: attendance });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private/Admin
export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({ success: false, error: 'Attendance record not found' });
    }

    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};