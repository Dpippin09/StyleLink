'use client';

import { Metadata } from 'next';

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You're Offline
          </h1>
          <p className="text-gray-600 mb-6">
            No internet connection detected. You can still browse previously viewed shoes and deals.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleReload}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">
            Available Offline:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Previously viewed shoe listings</li>
            <li>• Saved price alerts</li>
            <li>• Cached search results</li>
            <li>• Basic navigation</li>
          </ul>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          StyleLink works offline thanks to PWA technology
        </p>
      </div>
    </div>
  );
}
