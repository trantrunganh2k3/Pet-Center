"use client";
import React from 'react';
import LoadingSkeleton from './LoadingSkeleton';

interface GlobalLoadingProps {
  type?: 'page' | 'table' | 'card' | 'form';
  rows?: number;
  title?: string;
  showHeader?: boolean;
  showFilters?: boolean;
}

const GlobalLoading: React.FC<GlobalLoadingProps> = ({ 
  type = 'page', 
  rows = 5, 
  title,
  showHeader = true,
  showFilters = false 
}) => {
  switch (type) {
    case 'page':
      return (
        <div className="p-6">
          {showHeader && (
            <div className="mb-6">
              <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
              {showFilters && (
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              )}
            </div>
          )}
          <LoadingSkeleton rows={rows} />
        </div>
      );

    case 'table':
      return (
        <div className="bg-white rounded-lg shadow">
          <LoadingSkeleton rows={rows} />
        </div>
      );

    case 'card':
      return (
        <div className="bg-white p-6 rounded-lg shadow animate-pulse">
          {title && <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      );

    case 'form':
      return (
        <div className="bg-white p-6 rounded-lg shadow animate-pulse">
          {title && <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>}
          <div className="space-y-4">
            {Array.from({ length: rows }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
            <div className="flex gap-2 pt-4">
              <div className="h-10 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      );

    default:
      return <LoadingSkeleton rows={rows} />;
  }
};

export default GlobalLoading;
