// client/src/App.js
import React, { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import AnalysisResults from './components/AnalysisResults';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const [analysisResults, setAnalysisResults] = useState(null);
  
  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    // Scroll to results
    window.scrollTo({
      top: document.getElementById('results-section')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };
  
  const resetAnalysis = () => {
    setAnalysisResults(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            ATS Resume Checker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Optimize your resume for Applicant Tracking Systems and boost your chances of getting an interview.
          </p>
        </div>
        
        <ResumeUpload onAnalysisComplete={handleAnalysisComplete} />
        
        <div id="results-section" className="mt-8">
          {analysisResults && (
            <>
              <AnalysisResults results={analysisResults} />
              <div className="text-center mt-8">
                <button
                  onClick={resetAnalysis}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                >
                  Check Another Resume
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;