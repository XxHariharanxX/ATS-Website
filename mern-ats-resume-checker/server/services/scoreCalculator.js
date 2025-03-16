// server/services/scoreCalculator.js
class ScoreCalculator {
    /**
     * Calculate overall ATS compatibility score
     * @param {Object} resumeData - Parsed resume data
     * @param {Object} keywordResults - Results from keyword matching
     * @param {Object} formatResults - Results from format checking
     * @returns {Object} - Score results
     */
    calculateScore(resumeData, keywordResults, formatResults) {
      // Calculate different score components
      const keywordScore = keywordResults.keywordMatchScore;
      const formatScore = this.calculateFormatScore(formatResults);
      const completenessScore = this.calculateCompletenessScore(resumeData);
      
      // Calculate weighted overall score
      // Keyword matching is the most important factor for ATS
      const overallScore = Math.round(
        (keywordScore * 0.6) + 
        (formatScore * 0.2) + 
        (completenessScore * 0.2)
      );
      
      return {
        overall: overallScore,
        keywordMatch: keywordScore,
        formatCompatibility: formatScore,
        sectionCompleteness: completenessScore
      };
    }
    
    /**
     * Calculate format compatibility score
     * @param {Object} formatResults - Format checking results
     * @returns {number} - Format score
     */
    calculateFormatScore(formatResults) {
      // Start with perfect score and subtract for each issue
      let score = 100;
      
      formatResults.issues.forEach(issue => {
        switch (issue.severity) {
          case 'high':
            score -= 15;
            break;
          case 'medium':
            score -= 10;
            break;
          case 'low':
            score -= 5;
            break;
        }
      });
      
      // Ensure score doesn't go below 0
      return Math.max(0, score);
    }
    
    /**
     * Calculate section completeness score
     * @param {Object} resumeData - Parsed resume data
     * @returns {number} - Completeness score
     */
    calculateCompletenessScore(resumeData) {
      let score = 0;
      
      // Check for presence and completeness of key sections
      // Contact information
      if (resumeData.fullName && resumeData.email && resumeData.phone) {
        score += 20;
      } else if ((resumeData.fullName && resumeData.email) || 
                 (resumeData.fullName && resumeData.phone)) {
        score += 10;
      }
      
      // Skills
      if (resumeData.skills && resumeData.skills.length > 0) {
        score += resumeData.skills.length >= 5 ? 20 : 10;
      }
      
      // Education
      if (resumeData.education && resumeData.education.length > 0) {
        score += 20;
      }
      
      // Experience
      if (resumeData.experience && resumeData.experience.length > 0) {
        score += resumeData.experience.length >= 2 ? 40 : 20;
      }
      
      return score;
    }
    
    /**
     * Generate recommendations based on analysis
     * @param {Object} resumeData - Parsed resume data
     * @param {Object} keywordResults - Keyword matching results
     * @param {Object} formatResults - Format checking results
     * @returns {Array} - Array of recommendations
     */
    generateRecommendations(resumeData, keywordResults, formatResults) {
      const recommendations = [];
      
      // Missing keywords recommendations
      if (keywordResults.missingKeywords.length > 0) {
        recommendations.push({
          section: 'Keywords',
          issue: 'Missing important keywords',
          recommendation: `Consider adding these keywords to your resume: ${keywordResults.missingKeywords.slice(0, 5).join(', ')}${keywordResults.missingKeywords.length > 5 ? ' and others' : ''}`
        });
      }
      
      // Format recommendations
      formatResults.issues.forEach(issue => {
        recommendations.push({
          section: 'Format',
          issue: issue.issue,
          recommendation: issue.recommendation
        });
      });
      
      // Contact information recommendations
      if (!resumeData.email || !resumeData.phone) {
        recommendations.push({
          section: 'Contact Information',
          issue: 'Incomplete contact details',
          recommendation: 'Ensure your resume includes both email and phone number for ATS to properly extract your contact information.'
        });
      }
      
      // Skills recommendations
      if (!resumeData.skills || resumeData.skills.length < 5) {
        recommendations.push({
          section: 'Skills',
          issue: 'Limited skills section',
          recommendation: 'Expand your skills section to include more relevant technical and soft skills that match the job description.'
        });
      }
      
      // Experience recommendations
      if (!resumeData.experience || resumeData.experience.length === 0) {
        recommendations.push({
          section: 'Experience',
          issue: 'Missing work experience',
          recommendation: 'Add detailed work experience with measurable achievements and results.'
        });
      } else if (resumeData.experience.some(exp => !exp.description || exp.description.length < 50)) {
        recommendations.push({
          section: 'Experience',
          issue: 'Limited experience descriptions',
          recommendation: 'Enhance your experience descriptions with specific accomplishments, metrics, and relevant keywords.'
        });
      }
      
      return recommendations;
    }
  }
  
  module.exports = new ScoreCalculator();