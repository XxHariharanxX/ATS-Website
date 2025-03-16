// server/services/formatChecker.js
class FormatChecker {
    /**
     * Check the format of a resume for ATS compatibility
     * @param {string} resumeText - Full text content of the resume
     * @param {string} fileType - The type of file (pdf, docx, etc.)
     * @returns {Object} - Format checking results
     */
    checkFormat(resumeText, fileType) {
      const issues = [];
      
      // Check for common format issues
      this.checkLength(resumeText, issues);
      this.checkHeaders(resumeText, issues);
      this.checkBulletPoints(resumeText, issues);
      this.checkFontConsistency(resumeText, issues);
      this.checkContactInfo(resumeText, issues);
      this.checkFileFormat(fileType, issues);
      
      return {
        issues,
        passesFormatCheck: issues.filter(issue => issue.severity === 'high').length === 0
      };
    }
    
    /**
     * Check if resume is too long or too short
     * @param {string} text - Resume text
     * @param {Array} issues - Issues array to add to
     */
    checkLength(text, issues) {
      const wordCount = text.split(/\s+/).length;
      
      if (wordCount < 300) {
        issues.push({
          issue: 'Resume might be too short',
          severity: 'medium',
          recommendation: 'Aim for a resume that contains at least 300-600 words to provide sufficient information for ATS systems and recruiters.'
        });
      } else if (wordCount > 1000) {
        issues.push({
          issue: 'Resume might be too long',
          severity: 'low',
          recommendation: 'Consider shortening your resume to keep it focused and concise. Most ATS systems work best with resumes under 1000 words.'
        });
      }
    }
    
    /**
     * Check for standard headers
     * @param {string} text - Resume text
     * @param {Array} issues - Issues array to add to
     */
    checkHeaders(text, issues) {
      const standardHeaders = [
        'EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT', 
        'EDUCATION', 'SKILLS', 'TECHNICAL SKILLS', 
        'PROJECTS', 'CERTIFICATIONS', 'SUMMARY', 'PROFILE'
      ];
      
      // Check if at least 3 standard headers are present
      const headerCount = standardHeaders.filter(header => 
        new RegExp(`\\b${header}\\b`, 'i').test(text)
      ).length;
      
      if (headerCount < 3) {
        issues.push({
          issue: 'Missing standard section headers',
          severity: 'high',
          recommendation: 'Use standard section headers like "Experience", "Education", "Skills" to ensure ATS systems can properly categorize your information.'
        });
      }
    }
    
    /**
     * Check for bullet points in experience sections
     * @param {string} text - Resume text
     * @param {Array} issues - Issues array to add to
     */
    checkBulletPoints(text, issues) {
      // This is a simplified check - assumes bullet points should exist after EXPERIENCE section
      const experienceSectionRegex = /EXPERIENCE(?:[\s\S]*?)(?=EDUCATION|SKILLS|CERTIFICATIONS|PROJECTS|$)/i;
      const experienceMatch = text.match(experienceSectionRegex);
      
      if (experienceMatch) {
        const experienceSection = experienceMatch[0];
        const hasBulletPoints = /[-•*]/.test(experienceSection);
        
        if (!hasBulletPoints) {
          issues.push({
            issue: 'No bullet points in experience section',
            severity: 'medium',
            recommendation: 'Use bullet points to highlight achievements and responsibilities in your experience section for better readability and ATS parsing.'
          });
        }
      }
    }
    
    /**
     * Check for font consistency (simplified - full check would need PDF metadata)
     * @param {string} text - Resume text
     * @param {Array} issues - Issues array to add to
     */
    checkFontConsistency(text, issues) {
      // This is a simplified check - a real check would need to analyze PDF/DOCX metadata
      // In this example, we're assuming font consistency based on proper spacing and formatting
      
      // Check for inconsistent spacing (multiple consecutive spaces)
      if (/\s{3,}/.test(text)) {
        issues.push({
          issue: 'Potential inconsistent formatting detected',
          severity: 'low',
          recommendation: 'Ensure consistent spacing and formatting throughout your resume. Use the same font family and size for each section category.'
        });
      }
    }
    
    /**
     * Check for proper contact information
     * @param {string} text - Resume text
     * @param {Array} issues - Issues array to add to
     */
    checkContactInfo(text, issues) {
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
      const phoneRegex = /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/;
      
      if (!emailRegex.test(text)) {
        issues.push({
          issue: 'Missing email address',
          severity: 'high',
          recommendation: 'Include a professional email address in your contact information for recruiters to reach you.'
        });
      }
      
      if (!phoneRegex.test(text)) {
        issues.push({
          issue: 'Missing phone number',
          severity: 'medium',
          recommendation: 'Include a phone number in your contact information. Format it consistently (e.g., XXX-XXX-XXXX).'
        });
      }
    }
    
    /**
     * Check if file format is ATS-friendly
     * @param {string} fileType - Type of file
     * @param {Array} issues - Issues array to add to
     */
    checkFileFormat(fileType, issues) {
      const atsCompatibleFormats = ['.pdf', '.docx', '.doc', '.txt'];
      
      if (!atsCompatibleFormats.includes(fileType.toLowerCase())) {
        issues.push({
          issue: 'Non-ATS-friendly file format',
          severity: 'high',
          recommendation: 'Use a standard file format like PDF or DOCX. Avoid image-based formats, specialized formats, or scanned documents.'
        });
      }
      
      if (fileType.toLowerCase() === '.pdf') {
        // Add a note about ensuring the PDF is text-based
        issues.push({
          issue: 'Ensure PDF is text-based',
          severity: 'low',
          recommendation: 'Make sure your PDF is created from a text document and not scanned. Scanned PDFs may not be properly read by ATS systems.'
        });
      }
    }
}

module.exports = FormatChecker;