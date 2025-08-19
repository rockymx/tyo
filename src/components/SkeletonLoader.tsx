import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="skeleton-container">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="skeleton-card"></div>
      ))}
    </div>
  );
}