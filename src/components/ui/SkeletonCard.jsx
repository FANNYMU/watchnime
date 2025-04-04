import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-dark-surface rounded-lg overflow-hidden shadow-card animate-pulse">
      {/* Image placeholder */}
      <div className="relative aspect-[3/4] bg-gray-700"></div>

      {/* Content placeholder */}
      <div className="p-3">
        {/* Title placeholder */}
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        
        {/* Info placeholder */}
        <div className="flex justify-between items-center mb-2">
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
          <div className="h-3 bg-gray-700 rounded w-1/4"></div>
        </div>
        
        {/* Status placeholder */}
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
