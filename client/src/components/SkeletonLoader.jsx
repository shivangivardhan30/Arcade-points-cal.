import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="app-card p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-4 bg-[#1E2A44] rounded w-1/3"></div>
        <div className="h-8 bg-[#1E2A44] rounded-full w-8"></div>
      </div>
      <div className="h-8 bg-[#1E2A44] rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-[#1E2A44] rounded w-3/4"></div>
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="app-card p-6 animate-pulse">
      <div className="h-6 bg-[#1E2A44] rounded w-1/4 mb-6"></div>
      <div className="h-48 bg-[#1E2A44] rounded w-full mb-4"></div>
      <div className="flex justify-between">
        <div className="h-3 bg-[#1E2A44] rounded w-16"></div>
        <div className="h-3 bg-[#1E2A44] rounded w-16"></div>
        <div className="h-3 bg-[#1E2A44] rounded w-16"></div>
      </div>
    </div>
  );
};

export const ListSkeleton = ({ rows = 3 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex justify-between items-center p-4 bg-[#0B1220] border border-[#1E2A44] rounded-xl">
          <div className="space-y-2 w-1/2">
            <div className="h-4 bg-[#1E2A44] rounded w-3/4"></div>
            <div className="h-3 bg-[#1E2A44] rounded w-1/2"></div>
          </div>
          <div className="h-8 bg-[#1E2A44] rounded w-16"></div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 4, cols = 4 }) => {
  return (
    <div className="app-card overflow-hidden animate-pulse">
      <div className="border-b border-[#1E2A44] bg-[#0B1220] p-4 flex gap-4">
        {Array.from({ length: cols }).map((_, cIdx) => (
          <div key={cIdx} className="h-4 bg-[#1E2A44] rounded flex-1"></div>
        ))}
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex gap-4">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div key={cIdx} className="h-4 bg-[#1E2A44] rounded flex-1"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
