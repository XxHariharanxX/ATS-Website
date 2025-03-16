// server/routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FormatChecker = require('../services/formatChecker');

// Create uploads directory with absolute path
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const formatChecker = new FormatChecker();

// @route   POST /api/resumes/analyze
// @desc    Analyze resume
router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    console.log('Received request:', { 
      file: req.file, 
      body: req.body,
      headers: req.headers 
    });

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { jobTitle, jobDescription } = req.body;
    if (!jobTitle || !jobDescription) {
      return res.status(400).json({ message: 'Job title and description are required' });
    }

    // Get file extension
    const fileType = path.extname(req.file.originalname).toLowerCase();
    
    // Read file content (for demo, using a sample text)
    const resumeText = "SUMMARY\nExperienced software developer\n\nEXPERIENCE\n• Developed web applications\n• Led team projects\n\nEDUCATION\nBS in Computer Science\n\nSKILLS\nJavaScript, React, Node.js\n\nCONTACT\njohn@example.com\n(123) 456-7890";
    
    // Analyze the resume
    const formatResults = formatChecker.checkFormat(resumeText, fileType);
    
    // Extract keywords from job description (simplified)
    const jobKeywords = jobDescription.toLowerCase()
      .match(/\b\w+\b/g)
      .filter(word => word.length > 3);
    
    // Extract keywords from resume (simplified)
    const resumeKeywords = resumeText.toLowerCase()
      .match(/\b\w+\b/g)
      .filter(word => word.length > 3);
    
    // Find matching and missing keywords
    const matchedKeywords = jobKeywords.filter(keyword => resumeKeywords.includes(keyword));
    const missingKeywords = jobKeywords.filter(keyword => !resumeKeywords.includes(keyword));
    
    // Calculate match score
    const matchScore = Math.round((matchedKeywords.length / jobKeywords.length) * 100);

    // Generate suggestions
    const suggestions = [];
    if (formatResults.issues.length > 0) {
      suggestions.push('Fix formatting issues to improve ATS compatibility');
    }
    if (missingKeywords.length > 0) {
      suggestions.push('Add missing keywords from the job description');
    }
    if (matchScore < 60) {
      suggestions.push('Tailor your resume more closely to the job requirements');
    }

    // Clean up: Delete uploaded file
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (deleteError) {
      console.error('Error deleting file:', deleteError);
    }

    const response = {
      format: formatResults,
      matchScore,
      keywords: matchedKeywords,
      missingKeywords: missingKeywords.slice(0, 10), // Limit to top 10 missing keywords
      suggestions: [
        ...suggestions,
        'Ensure your resume is properly formatted for ATS systems',
        'Use industry-standard section headers',
        'Include quantifiable achievements'
      ]
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ 
      message: 'Error analyzing resume. Please try again.',
      error: error.message 
    });
  }
});

module.exports = router;