"use client";

/* eslint-disable   @typescript-eslint/no-unused-vars */
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import OptimizedImage from "./OptimizeManga";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FixedSizeList as List } from "react-window";
import { useState, useCallback, useRef } from "react";
import { MangaPageItem } from "./pageItem";
import { useIntersectionObserver } from "@/hooks/intersection";

export type ImageType = "comic" | "ads";

export interface ExtractedImage {
  type: ImageType;
  imageUrl: string;
  alt?: string;
  linkUrl?: string;
}

export interface ImageExtractionResponse {
  success: boolean;
  data: ExtractedImage[];
}

const IntersectionObserverMangaReader = ({
  comicImages,
  slug,
}: {
  comicImages: ExtractedImage[];
  slug: string;
}) => {
  const { visiblePages, observe } = useIntersectionObserver();
  const [currentPage, setCurrentPage] = useState(1);

  const handleRef = useCallback(
    (element: HTMLDivElement | null, index: number) => {
      if (element) {
        observe(element, index + 1);
      }
    },
    [observe]
  );

  return (
    <div className="flex flex-col">
      {/* Current page indicator */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b p-2 text-center">
        <span className="text-sm font-medium">
          Reading: Page {Math.max(...Array.from(visiblePages), 0) || 1} /{" "}
          {comicImages.length}
        </span>
      </div>

      {comicImages.map((img, idx) => (
        <div
          key={`${slug}-${idx}`}
          ref={(el) => handleRef(el, idx)}
          className="w-full min-h-[400px]"
        >
          {visiblePages.has(idx + 1) ? (
            <OptimizedImage
              src={img.imageUrl}
              alt={img.alt || `Manga page ${idx + 1}`}
              index={idx}
            />
          ) : (
            <div className="w-full h-[450px] bg-gray-100 rounded flex items-center justify-center">
              <div className="text-gray-400">Loading page {idx + 1}...</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const VirtualizedMangaReader = ({
  comicImages,
  slug,
}: {
  comicImages: ExtractedImage[];
  slug: string;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef<List>(null);

  const handlePageView = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const itemData = {
    images: comicImages,
    slug,
    onPageView: handlePageView,
  };

  // Scroll to specific page
  const scrollToPage = useCallback((pageNumber: number) => {
    if (listRef.current) {
      listRef.current.scrollToItem(pageNumber - 1, "center");
    }
  }, []);

  return (
    <div className="relative">
      {/* Page navigation */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b p-2">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div className="text-sm font-medium">
            Page {currentPage} / {comicImages.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={() =>
                scrollToPage(Math.min(comicImages.length, currentPage + 1))
              }
              disabled={currentPage >= comicImages.length}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <List
        ref={listRef}
        height={800}
        itemCount={comicImages.length}
        itemSize={500}
        itemData={itemData}
        width="100%"
      >
        {MangaPageItem}
      </List>
    </div>
  );
};

export default function ReadManga({ slug }: { slug: string }) {
  const [useVirtualization, setUseVirtualization] = useState(false);
  const modifSlug = slug.replace(/(one-piece)(-)(?=chapter)/, "$1-berwarna$2");

  const { data, isLoading, error } = useSWR<ImageExtractionResponse>(
    `/api/read/${modifSlug}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const chapterNumber = parseInt(slug.match(/chapter-(\d+)/)?.[1] || "0", 10);
  const getSlugWithChapter = (chapter: number) =>
    slug.replace(/chapter-\d+/, `chapter-${chapter}`);
  const prevSlug = getSlugWithChapter(chapterNumber - 1);
  const nextSlug = getSlugWithChapter(chapterNumber + 1);

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading manga pages...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
          <div className="text-red-500 mb-2">❌</div>
          <p className="text-red-700 font-medium">Loading.....</p>
          <p className="text-red-600 text-sm mt-1">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  // No data state
  if (!data || !data.success || !data.data.length) {
    return (
      <div className="p-4">
        <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-yellow-500 mb-2">📭</div>
          <p className="text-yellow-700 font-medium">No manga pages found</p>
          <p className="text-yellow-600 text-sm mt-1">
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
      <div className="flex justify-between mb-4 items-center">
        <Link
          href={`/read/${prevSlug}`}
          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Link>

        {/* Virtualization toggle */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">
            <input
              type="checkbox"
              checked={useVirtualization}
              onChange={(e) => setUseVirtualization(e.target.checked)}
              className="mr-1"
            />
            Virtual Scrolling
          </label>
        </div>

        <Link
          href={`/read/${nextSlug}`}
          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Header info */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl">{slug}</h1>
        <p className="text-gray-600 text-xs">
          {comicImages.length} page{comicImages.length !== 1 ? "s" : ""} loaded
        </p>
        {comicImages.length > 20 && (
          <p className="text-blue-600 text-xs mt-1">
            💡 Try virtual scrolling for better performance
          </p>
        )}
      </div>

      {/* Conditional rendering based on virtualization setting */}
      {useVirtualization ? (
        <VirtualizedMangaReader comicImages={comicImages} slug={slug} />
      ) : (
        <IntersectionObserverMangaReader
          comicImages={comicImages}
          slug={slug}
        />
      )}

      {/* Footer info */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>End of chapter</p>
      </div>
      <div className="flex justify-between mb-4 items-center">
        <Link
          href={`/read/${prevSlug}`}
          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Link>

        <Link
          href={`/read/${nextSlug}`}
          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
