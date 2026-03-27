// app/dashboard/loading.tsx
import React from 'react';

export default function DashboardLoadingSkeleton() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-pulse">
      
      {/* 1. Header Skeleton */}
      <header className="flex justify-between items-end border-b pb-4">
        <div className="space-y-3">
          {/* Title Block */}
          <div className="h-8 w-64 bg-slate-200 rounded-md"></div>
          {/* Subtitle Block */}
          <div className="h-4 w-48 bg-slate-200 rounded-md"></div>
        </div>
        {/* Export Button Block */}
        <div className="h-10 w-32 bg-slate-200 rounded-md"></div>
      </header>

      {/* 2. Top Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((card) => (
          <div key={card} className="bg-white p-6 rounded-xl border shadow-sm">
            {/* Card Label */}
            <div className="h-4 w-32 bg-slate-200 rounded-md mb-4"></div>
            {/* Card Huge Number */}
            <div className="h-10 w-16 bg-slate-200 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* 3. Detailed Technical Data Skeleton */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b">
          <div className="h-6 w-64 bg-slate-200 rounded-md"></div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          {[1, 2, 3, 4].map((item) => (
            <div key={item}>
              <div className="h-4 w-24 bg-slate-200 rounded-md mb-2"></div>
              <div className="h-6 w-full max-w-[200px] bg-slate-200 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SANs Cloud Skeleton */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b">
          <div className="h-6 w-48 bg-slate-200 rounded-md"></div>
        </div>
        <div className="p-6 flex flex-wrap gap-2">
          {/* Create 15 random pill shapes to simulate SANs */}
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="h-6 bg-slate-200 rounded-full"
              style={{ width: `${Math.floor(Math.random() * (120 - 60 + 1) + 60)}px` }}
            ></div>
          ))}
        </div>
      </div>

    </div>
  );
}