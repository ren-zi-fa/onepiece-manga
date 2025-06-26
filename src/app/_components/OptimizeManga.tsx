"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  index: number;
}
const OptimizedImage = ({ src, alt, index }: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-[450px] bg-gray-100 rounded overflow-hidden">
      {!hasError ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
              <div className="text-gray-500">Loading image...</div>
            </div>
          )}
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            style={{ objectFit: "contain" }}
            className={`rounded transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
            priority={index < 3}
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
            onLoad={(e) => {
              if ((e.target as HTMLImageElement).naturalWidth === 0) {
                setHasError(true);
              }
              setIsLoading(false);
            }}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <div className="mb-2 text-xl">⚠️</div>
            <div className="text-sm">try refresh page</div>
            <div className="text-xs mt-1">Image {index + 1}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
