import Student from '../models/Student.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all students
// @route   GET /api/students
// @access  Private
export const getStudents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, className, search } = req.query;
  
  const query = {};
  
  if (className) {
    query.className = className;
  }
  
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: 'createdBy'
  };

  const students = await Student.paginate(query, options);

  res.json({
    success: true,
    ...students
  });
});

// @desc    Create student
// @route   POST /api/students
// @access  Private/Admin
export const createStudent = asyncHandler(async (req, res) => {
  const { name, age, className, performance } = req.body;
  
  const student = await Student.create({
    name,
    age,
    className,
    performance,
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    data: await Student.findById(student._id).populate('createdBy', 'name email')
  });
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
export const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('createdBy', 'name email');

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  res.json({
    success: true,
    data: student
  });
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Get student performance
// @route   GET /api/students/:id/performance
// @access  Private
export const getStudentPerformance = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .select('performance')
    .populate('createdBy', 'name');

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  res.json({
    success: true,
    data: student.performance
  });
});