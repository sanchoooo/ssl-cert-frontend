"use client"; // This directive tells Next.js to ship this JS to the browser

import React, { useState } from 'react';

export default function SansFilter({ sans = [] }: { sans: string[] }) {
  // State to hold the user's search input
  const [searchTerm, setSearchTerm] = useState('');

  // Filter the array based on the search term (case-insensitive)
  const filteredSans = sans.filter((san) =>
    san.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      
      {/* Header with Search Bar */}
      <div className="bg-slate-50 px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Subject Alternative Names ({sans.length})
        </h2>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search domains..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
        </div>
      </div>

      {/* Filtered Results Cloud */}
      <div className="p-6">
        {filteredSans.length === 0 ? (
          <p className="text-slate-500 text-sm py-4 text-center">
            No domains matching "{searchTerm}"
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filteredSans.map((san) => (
              <span 
                key={san} 
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200 transition-colors hover:bg-blue-100 cursor-default"
              >
                {san}
              </span>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}