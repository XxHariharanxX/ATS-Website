// server/services/keywordMatcher.js
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stopwords = require('stopwords').english;

class KeywordMatcher {
  /**
   * Match keywords between resume and job description
   * @param {string} resumeText - Full text of the resume
   * @param {string} jobDescription - Full text of the job description
   * @returns {Object} - Matching results
   */
  matchKeywords(resumeText, jobDescription) {
    const importantKeywords = this.extractImportantKeywords(jobDescription);
    const resumeTokens = this.tokenizeAndNormalize(resumeText);
    
    const results = {
      matchedKeywords: [],
      missingKeywords: [],
      keywordMatchScore: 0
    };
    
    // Check for each important keyword
    importantKeywords.forEach(keyword => {
      // For multi-word keywords, check if all words appear close to each other
      const keywordTokens = tokenizer.tokenize(keyword.toLowerCase());
      
      if (keywordTokens.length > 1) {
        // Check if the phrase exists in the resume
        if (resumeText.toLowerCase().includes(keyword.toLowerCase())) {
          const count = this.countOccurrences(resumeText.toLowerCase(), keyword.toLowerCase());
          results.matchedKeywords.push({ keyword, count });
        } else {
          results.missingKeywords.push(keyword);
        }
      } else {
        // Single word keyword
        if (resumeTokens.includes(keyword.toLowerCase())) {
          const count = resumeTokens.filter(token => token === keyword.toLowerCase()).length;
          results.matchedKeywords.push({ keyword, count });
        } else {
          results.missingKeywords.push(keyword);
        }
      }
    });
    
    // Calculate the match score (percentage of important keywords found)
    results.keywordMatchScore = Math.round(
      (results.matchedKeywords.length / importantKeywords.length) * 100
    );
    
    return results;
  }
  
  /**
   * Extract important keywords from job description
   * @param {string} jobDescription - Job description text
   * @returns {Array} - Array of important keywords
   */
  extractImportantKeywords(jobDescription) {
    // Tokenize the job description
    const tokens = this.tokenizeAndNormalize(jobDescription);
    
    // Count frequency of each token
    const tokenFrequency = {};
    tokens.forEach(token => {
      if (!stopwords.includes(token) && token.length > 2) {
        tokenFrequency[token] = (tokenFrequency[token] || 0) + 1;
      }
    });
    
    // Get common phrases (n-grams)
    const text = jobDescription.toLowerCase();
    const phrases = this.extractPhrases(text);
    
    // Combine single tokens and phrases based on frequency and relevance
    const allKeywords = [
      ...Object.entries(tokenFrequency)
        .filter(([token, freq]) => freq > 1) // Only include tokens that appear more than once
        .map(([token]) => token),
      ...phrases
    ];
    
    // Hard-coded technical skills that are commonly sought
    const technicalSkills = [
      'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Java', 'Python',
      'AWS', 'Docker', 'Kubernetes', 'Git', 'CI/CD', 'Agile', 'Scrum', 'REST API',
      'Frontend', 'Backend', 'Full Stack', 'DevOps', 'Cloud', 'Microservices'
    ];
    
    // Add technical skills that are mentioned in the job description
    technicalSkills.forEach(skill => {
      if (jobDescription.toLowerCase().includes(skill.toLowerCase()) && 
          !allKeywords.includes(skill)) {
        allKeywords.push(skill);
      }
    });
    
    // Remove duplicates and limit to top keywords
    return [...new Set(allKeywords)].slice(0, 30);
  }
  
  /**
   * Tokenize and normalize text
   * @param {string} text - Input text
   * @returns {Array} - Array of normalized tokens
   */
  tokenizeAndNormalize(text) {
    return tokenizer
      .tokenize(text.toLowerCase())
      .filter(token => token.length > 1 && /[a-z0-9]/.test(token));
  }
  
  /**
   * Extract common phrases from text
   * @param {string} text - Input text
   * @returns {Array} - Array of important phrases
   */
  extractPhrases(text) {
    // Common job description phrases
    const commonPhrases = [
      'problem solving', 'team player', 'attention to detail', 
      'communication skills', 'project management', 'time management',
      'critical thinking', 'product development', 'user experience',
      'cross-functional', 'self-motivated', 'fast-paced environment'
    ];
    
    return commonPhrases.filter(phrase => text.includes(phrase));
  }
  
  /**
   * Count occurrences of a substring in a string
   * @param {string} text - The text to search in
   * @param {string} substring - The substring to search for
   * @returns {number} - Number of occurrences
   */
  countOccurrences(text, substring) {
    let count = 0;
    let position = text.indexOf(substring);
    
    while (position !== -1) {
      count++;
      position = text.indexOf(substring, position + 1);
    }
    
    return count;
  }
}

module.exports = new KeywordMatcher();