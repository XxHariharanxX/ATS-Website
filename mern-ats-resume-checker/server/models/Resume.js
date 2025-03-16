// server/models/Resume.js
const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx', 'doc', 'txt'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  parsedData: {
    fullName: String,
    email: String,
    phone: String,
    skills: [String],
    education: [{
      degree: String,
      institution: String,
      date: String
    }],
    experience: [{
      title: String,
      company: String,
      date: String,
      description: String
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', ResumeSchema);