// server/services/resumeParser.js
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

class ResumeParser {
  /**
   * Parse a resume file based on its type
   * @param {string} filePath - Path to the resume file
   * @param {string} fileType - Type of file (pdf, docx, doc, txt)
   * @returns {Promise<string>} - Extracted text content
   */
  async parseResume(filePath, fileType) {
    try {
      switch (fileType.toLowerCase()) {
        case 'pdf':
          return await this.parsePdf(filePath);
        case 'docx':
          return await this.parseDocx(filePath);
        case 'txt':
          return await this.parseTxt(filePath);
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      console.error('Error parsing resume:', error);
      throw new Error(`Failed to parse resume: ${error.message}`);
    }
  }

  /**
   * Parse PDF file
   * @param {string} filePath - Path to PDF file
   * @returns {Promise<string>} - Extracted text
   */
  async parsePdf(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  /**
   * Parse DOCX file
   * @param {string} filePath - Path to DOCX file
   * @returns {Promise<string>} - Extracted text
   */
  async parseDocx(filePath) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  /**
   * Parse TXT file
   * @param {string} filePath - Path to TXT file
   * @returns {Promise<string>} - File content
   */
  async parseTxt(filePath) {
    return fs.readFileSync(filePath, 'utf8');
  }

  /**
   * Extract structured data from resume text
   * @param {string} text - Resume text content
   * @returns {Object} - Structured resume data
   */
  extractStructuredData(text) {
    // This is a simplified example - in a real app, you'd use more sophisticated
    // NLP and pattern matching techniques
    
    const parsedData = {
      fullName: this.extractFullName(text),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      skills: this.extractSkills(text),
      education: this.extractEducation(text),
      experience: this.extractExperience(text)
    };
    
    return parsedData;
  }

  extractFullName(text) {
    // Basic name extraction - would need improvement in real app
    const nameRegex = /^([A-Z][a-z]+ [A-Z][a-z]+)/m;
    const match = text.match(nameRegex);
    return match ? match[1] : '';
  }

  extractEmail(text) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    const match = text.match(emailRegex);
    return match ? match[0] : '';
  }

  extractPhone(text) {
    const phoneRegex = /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/;
    const match = text.match(phoneRegex);
    return match ? match[0] : '';
  }

  extractSkills(text) {
    // This is simplified - a real implementation would use more sophisticated techniques
    const commonSkills = [
      'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB',
      'AWS', 'Docker', 'Git', 'Agile', 'Communication', 'Leadership',
      'Project Management', 'Machine Learning', 'Data Analysis'
    ];
    
    return commonSkills.filter(skill => 
      new RegExp(`\\b${skill}\\b`, 'i').test(text)
    );
  }

  extractEducation(text) {
    // Simple education extraction - would need NLP in real app
    const educationSection = this.extractSection(text, 
      ['EDUCATION', 'ACADEMIC BACKGROUND', 'ACADEMIC CREDENTIALS']);
    
    if (!educationSection) return [];
    
    // Very simplified extraction - real implementation would be more complex
    const degreeRegex = /(Bachelor|Master|PhD|B\.S\.|M\.S\.|M\.B\.A\.|B\.A\.|B\.E\.)\s+(?:of|in)?\s+([A-Za-z\s]+)/gi;
    const matches = [...educationSection.matchAll(degreeRegex)];
    
    return matches.map(match => ({
      degree: match[0],
      institution: '', // Would need more sophisticated extraction
      date: ''         // Would need more sophisticated extraction
    }));
  }

  extractExperience(text) {
    // Simple experience extraction - would need NLP in real app
    const experienceSection = this.extractSection(text, 
      ['EXPERIENCE', 'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE', 'EMPLOYMENT']);
    
    if (!experienceSection) return [];
    
    // This is extremely simplified - real implementation would use NLP
    const lines = experienceSection.split('\n').filter(line => line.trim());
    const experiences = [];
    
    for (let i = 0; i < lines.length; i++) {
      if (/\d{4}\s*-\s*(\d{4}|present)/i.test(lines[i])) {
        experiences.push({
          title: lines[i-1] || '',
          company: lines[i-2] || '',
          date: lines[i],
          description: lines[i+1] || ''
        });
      }
    }
    
    return experiences;
  }

  extractSection(text, sectionHeaders) {
    // Find the section based on possible headers
    for (const header of sectionHeaders) {
      const regex = new RegExp(`${header}[:\\s]*(.*?)(?=\\n\\s*[A-Z][A-Z\\s]+[:\\s]*|$)`, 'is');
      const match = text.match(regex);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return null;
  }
}

module.exports = new ResumeParser();