"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  index: number;
  priority?: boolean;
}

const OptimizedImage = ({
  src,
  alt,
  index,
  priority = false,
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 2;

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setHasError(false);
    setIsLoading(true);
  };

  // Generate unique src untuk retry
  const getSrcWithRetry = () => {
    if (retryCount === 0) return src;
    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}retry=${retryCount}&t=${Date.now()}`;
  };

  return (
    <div className="relative w-full h-[450px] bg-gray-100 rounded overflow-hidden">
      {!hasError ? (
        <div className="relative w-full h-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <div className="text-gray-500 text-sm">
                  Loading page {index + 1}...
                  {retryCount > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      Attempt {retryCount + 1}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <Image
            src={getSrcWithRetry()}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
            style={{
              objectFit: "contain",
              objectPosition: "center",
            }}
            className={`rounded transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            priority={priority || index < 3}
            quality={85}
            loading={priority || index < 3 ? "eager" : "lazy"}
            unoptimized={false}
            onLoad={() => {
              setIsLoading(false);
              setHasError(false);
            }}
            onError={() => {
              if (retryCount < MAX_RETRIES) {
                // Auto retry dengan delay
                setTimeout(() => {
                  handleRetry();
                }, 1000);
              } else {
                setHasError(true);
                setIsLoading(false);
              }
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500 p-4">
            <div className="mb-3 text-2xl">⚠️</div>
            <div className="text-sm font-medium mb-2">Failed to load image</div>
            <div className="text-xs mb-3 text-gray-400">
              Page {index + 1} • {retryCount + 1} attempts
            </div>
            <button
              onClick={() => {
                setRetryCount(0);
                setHasError(false);
                setIsLoading(true);
              }}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;