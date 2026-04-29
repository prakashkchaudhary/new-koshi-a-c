import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="min-h-64 flex flex-col items-center justify-center py-20">
    <div className="relative w-16 h-16 mb-4">
      <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
      <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      <div className="absolute inset-3 rounded-full bg-blue-50 flex items-center justify-center">
        <span className="text-blue-600 text-xs font-black">NK</span>
      </div>
    </div>
    <p className="text-gray-500 text-sm font-medium">{message}</p>
  </div>
);

export default LoadingSpinner;
