// server/models/ResumeAnalysis.js
const mongoose = require('mongoose');

const ResumeAnalysisSchema = new mongoose.Schema({
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  scores: {
    overall: {
      type: Number,
      required: true
    },
    keywordMatch: {
      type: Number,
      required: true
    },
    formatCompatibility: {
      type: Number,
      required: true
    },
    sectionCompleteness: {
      type: Number,
      required: true
    }
  },
  missingKeywords: [{
    type: String
  }],
  matchedKeywords: [{
    keyword: String,
    count: Number
  }],
  formatIssues: [{
    issue: String,
    severity: String,
    recommendation: String
  }],
  recommendations: [{
    section: String,
    issue: String,
    recommendation: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);