import React from 'react';

interface NoResultsProps {
  icon: string;
  title: string;
  description: string;
}

export default function NoResults({ icon, title, description }: NoResultsProps) {
  return (
    <div className="no-results">
      <div className="no-results-icon">
        <i className={icon}></i>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}