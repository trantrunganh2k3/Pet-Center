"use client";
import Image from "next/image";
import { useState } from "react";

interface ImageWithLoadingProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

const ImageWithLoading: React.FC<ImageWithLoadingProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  fill = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-gray-400 text-sm">Đang tải...</div>
        </div>
      )}
      
      {hasError && (
        <div 
          className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
          style={{ width, height }}
        >
          <div className="text-gray-500 text-sm text-center">
            <div>⚠️</div>
            <div>Không thể tải ảnh</div>
          </div>
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${hasError ? 'hidden' : ''} ${className}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default ImageWithLoading;
