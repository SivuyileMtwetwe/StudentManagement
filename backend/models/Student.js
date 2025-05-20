import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  subject: { 
    type: String, 
    required: [true, 'Subject is required'],
    trim: true
  },
  score: { 
    type: Number, 
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be less than 0'],
    max: [100, 'Score cannot exceed 100']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [5, 'Minimum age is 5'],
    max: [25, 'Maximum age is 25']
  },
  className: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true,
    enum: {
      values: ['8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B'],
      message: 'Invalid class name'
    }
  },
  performance: [performanceSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
studentSchema.index({ name: 1 });
studentSchema.index({ className: 1 });
studentSchema.index({ createdAt: -1 });

// Static method to get average scores
studentSchema.statics.getAverageScores = async function(studentId) {
  const [result] = await this.aggregate([
    { $match: { _id: studentId } },
    { $unwind: '$performance' },
    {
      $group: {
        _id: '$_id',
        averageScore: { $avg: '$performance.score' }
      }
    }
  ]);
  
  return result?.averageScore || 0;
};

// Instance method to get performance summary
studentSchema.methods.getPerformanceSummary = function() {
  return this.performance.reduce((acc, curr) => {
    acc[curr.subject] = curr.score;
    return acc;
  }, {});
};

const Student = mongoose.model('Student', studentSchema);

export default Student;