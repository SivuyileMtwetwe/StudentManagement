import dotenv from 'dotenv';
dotenv.config();

export const config = {
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/student_management',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  }
};