import Material from '../models/Material.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

// @desc    Upload new material
// @route   POST /api/materials
// @access  Private/Teacher
export const uploadMaterial = asyncHandler(async (req, res) => {
  const { title, description, fileType, category, class: className, subject } = req.body;
  const fileUrl = req.file.path; // Assuming file upload middleware

  const material = await Material.create({
    title,
    description,
    fileUrl,
    fileType,
    category,
    class: className,
    subject,
    uploadedBy: req.user.id
  });

  res.status(201).json({
    success: true,
    data: await material.populate('uploadedBy', 'name email')
  });
});

// @desc    Get all materials
// @route   GET /api/materials
// @access  Private
export const getMaterials = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, class: className, subject, category, search } = req.query;
  
  const query = {};
  if (className) query.class = className;
  if (subject) query.subject = subject;
  if (category) query.category = category;
  
  if (search) {
    query.$text = { $search: search };
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { uploadDate: -1 },
    populate: 'uploadedBy'
  };

  const materials = await Material.paginate(query, options);

  res.json({
    success: true,
    ...materials
  });
});

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private/Admin or Uploader
export const deleteMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id);
  
  if (!material) {
    res.status(404);
    throw new Error('Material not found');
  }

  // Check if user is admin or uploader
  if (material.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this material');
  }

  await material.remove();
  
  // TODO: Delete actual file from storage

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Update material metadata
// @route   PUT /api/materials/:id
// @access  Private/Admin or Uploader
export const updateMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('uploadedBy', 'name email');

  if (!material) {
    res.status(404);
    throw new Error('Material not found');
  }

  res.json({
    success: true,
    data: material
  });
});