// client/src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white shadow-md mt-8">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col items-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} ATS Resume Checker. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Built with React, Node.js, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;