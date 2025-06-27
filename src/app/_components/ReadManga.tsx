"use client";

import OptimizedImage from "./OptimizeManga";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useReadingData } from "@/hooks/useReadingStore";

export default function ReadManga({ slug }: { slug: string }) {


  const modifSlug = slug.replace(/(one-piece)(-)(?=chapter)/, "$1-berwarna$2");
  const { data, isLoading, error } = useReadingData(modifSlug);

  const chapterNumber = parseInt(slug.match(/chapter-(\d+)/)?.[1] || "0", 10);
  const getSlugWithChapter = (chapter: number) =>
    slug.replace(/chapter-\d+/, `chapter-${chapter}`);
  const prevSlug = getSlugWithChapter(chapterNumber - 1);
  const nextSlug = getSlugWithChapter(chapterNumber + 1);


  // Loading state with better UX
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading manga pages...
          </p>
          <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <div className="p-4">
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200 max-w-md mx-auto">
          <div className="text-red-500 mb-4 text-3xl">❌</div>
          <p className="text-red-700 font-medium text-lg mb-2">
            Failed to load chapter
          </p>
          <p className="text-red-600 text-sm mb-4">
            Please check your connection and try again
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!data || !data.success || !data.data.length) {
    return (
      <div className="p-4">
        <div className="text-center py-12 bg-yellow-50 rounded-lg border border-yellow-200 max-w-md mx-auto">
          <div className="text-yellow-500 mb-4 text-3xl">📭</div>
          <p className="text-yellow-700 font-medium text-lg mb-2">
            No pages found
          </p>
          <p className="text-yellow-600 text-sm">
            This chapter might be empty or unavailable
          </p>
        </div>
      </div>
    );
  }

  const comicImages = data.data.filter((img) => img.type === "comic");

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Navigation */}
      <div className="flex justify-between mb-6 items-center bg-gray-50 p-3 rounded-lg">
        <Link
          href={`/read/${prevSlug}`}
          className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Chapter
        </Link>


        <Link
          href={`/read/${nextSlug}`}
          className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          Next Chapter
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Header info */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{slug.replace(/-/g, " ")}</h1>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
          <span>
            {comicImages.length} page{comicImages.length !== 1 ? "s" : ""}
          </span>
     
        </div>
      </div>

      <div className="space-y-4 py-4">
        {comicImages.map((img, idx) => (
          <div key={`${slug}-${idx}`} className="w-full min-h-[400px] px-4">
            <div className="mb-4">
              <OptimizedImage
                src={img.imageUrl}
                alt={img.alt || `Manga page ${idx + 1}`}
                index={idx}
                priority={true}
              />
              <div className="text-center mt-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Page {idx + 1}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <div className="py-8 border-t border-gray-200">
          <p className="text-gray-500 text-lg font-medium mb-4">
            End of Chapter
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href={`/read/${prevSlug}`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous Chapter
            </Link>
            <Link
              href={`/read/${nextSlug}`}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              Next Chapter
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
