// client/src/components/AnalysisResults.js
import React from 'react';

const AnalysisResults = ({ results }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Analysis Results</h2>
      
      {/* Format Score */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Format Check</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700">Format Score:</span>
            <span className={`font-bold ${results.format.passesFormatCheck ? 'text-green-600' : 'text-yellow-600'}`}>
              {results.format.passesFormatCheck ? 'Passed' : 'Needs Improvement'}
            </span>
          </div>
          {results.format.issues.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Issues Found:</h4>
              <ul className="space-y-2">
                {results.format.issues.map((issue, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`inline-block w-2 h-2 rounded-full mt-1.5 mr-2 ${
                      issue.severity === 'high' ? 'bg-red-500' :
                      issue.severity === 'medium' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></span>
                    <div>
                      <p className="text-gray-800">{issue.issue}</p>
                      <p className="text-sm text-gray-600">{issue.recommendation}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Match Score */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Job Match Score</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700">Overall Match:</span>
            <span className="font-bold text-lg">
              {results.matchScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${results.matchScore}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Keywords */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Keywords Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2 text-green-600">Found Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {results.keywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2 text-red-600">Missing Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {results.missingKeywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Suggestions */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Improvement Suggestions</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <ul className="space-y-2">
            {results.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-center">
                <span className="text-blue-500 mr-2">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;