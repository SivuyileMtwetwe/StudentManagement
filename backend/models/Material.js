import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'video', 'image', 'other']
  },
  category: {
    type: String,
    required: true,
    enum: ['lecture', 'assignment', 'notes', 'recording', 'other']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  class: {
    type: String,
    required: true,
    enum: ['8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B']
  },
  subject: {
    type: String,
    required: true,
    enum: ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Other']
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

// Text index for search
materialSchema.index({ title: 'text', description: 'text' });

const Material = mongoose.model('Material', materialSchema);

export default Material;