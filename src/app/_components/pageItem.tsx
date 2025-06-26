"use client";

import { useEffect } from "react";
import { ExtractedImage } from "./ReadManga";
import OptimizedImage from "./OptimizeManga";

export const MangaPageItem = ({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: {
    images: ExtractedImage[];
    slug: string;
    onPageView: (pageNumber: number) => void;
  };
}) => {
  const { images, onPageView } = data;
  const img = images[index];

  useEffect(() => {
    onPageView(index + 1);
  }, [index, onPageView]);

  if (!img) return null;

  return (
    <div style={style} className="px-4">
      <div className="w-full mb-4">
        <OptimizedImage
          src={img.imageUrl}
          alt={img.alt || `Manga page ${index + 1}`}
          index={index}
        />

        <div className="text-center mt-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Page {index + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
};
