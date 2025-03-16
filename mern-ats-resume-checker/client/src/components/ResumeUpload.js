// client/src/components/ResumeUpload.js
import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';

const ResumeUpload = ({ onAnalysisComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Check if file is PDF or DOCX
    if (file) {
      const fileType = file.name.split('.').pop().toLowerCase();
      if (['pdf', 'docx', 'doc', 'txt'].includes(fileType)) {
        setSelectedFile(file);
        setErrorMessage('');
      } else {
        setSelectedFile(null);
        setErrorMessage('Please upload a PDF, DOCX, DOC, or TXT file');
      }
    }
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  const handleJobTitleChange = (event) => {
    setJobTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setErrorMessage('Please select a resume file');
      return;
    }
    
    if (!jobDescription) {
      setErrorMessage('Please enter the job description');
      return;
    }
    
    if (!jobTitle) {
      setErrorMessage('Please enter the job title');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage('');
    
    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('jobDescription', jobDescription);
    formData.append('jobTitle', jobTitle);
    
    try {
      console.log('Sending request with:', {
        file: selectedFile.name,
        jobTitle,
        jobDescriptionLength: jobDescription.length
      });

      const response = await axios.post('/api/resumes/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });
      
      console.log('Received response:', response.data);
      
      if (response.data) {
        // Call the parent component's callback with the analysis results
        onAnalysisComplete(response.data);
        
        // Reset the form
        setSelectedFile(null);
        setJobDescription('');
        setJobTitle('');
        setErrorMessage('');
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      setErrorMessage(
        error.response?.data?.message || 
        error.message ||
        'Failed to analyze resume. Please try again.'
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        ATS Resume Checker
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Upload Your Resume
          </label>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.txt"
            />
            
            {selectedFile ? (
              <div className="flex items-center justify-center">
                <FaCheck className="text-green-500 mr-2" />
                <span>{selectedFile.name}</span>
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => setSelectedFile(null)}
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <label htmlFor="resume-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <FaUpload className="text-4xl text-gray-400 mb-2" />
                  <p className="text-gray-700">
                    Drag and drop your resume or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supports PDF, DOCX, DOC, and TXT files
                  </p>
                </div>
              </label>
            )}
          </div>
        </div>
        
        {/* Job Title */}
        <div className="mb-4">
          <label 
            className="block text-gray-700 text-sm font-bold mb-2" 
            htmlFor="job-title"
          >
            Job Title
          </label>
          <input
            id="job-title"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="E.g., Frontend Developer, Data Scientist"
            value={jobTitle}
            onChange={handleJobTitleChange}
            required
          />
        </div>
        
        {/* Job Description */}
        <div className="mb-4">
          <label 
            className="block text-gray-700 text-sm font-bold mb-2" 
            htmlFor="job-description"
          >
            Job Description
          </label>
          <textarea
            id="job-description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={8}
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Paste the complete job description to get the most accurate results
          </p>
        </div>
        
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}
        
        {/* Upload Progress */}
        {isUploading && uploadProgress > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1 text-center">
              {uploadProgress}% uploaded
            </p>
          </div>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center disabled:opacity-50"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Analyzing Resume...
            </>
          ) : (
            <>
              <FaUpload className="mr-2" />
              Analyze Resume
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ResumeUpload;