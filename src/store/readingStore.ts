import { create } from "zustand";
import { ImageExtractionResponse } from "@/types";

type ImageCache = Record<string, ImageExtractionResponse>;

type ImageState = {
  cache: ImageCache;
  setCache: (slug: string, data: ImageExtractionResponse) => void;
};

export const useReadingStore = create<ImageState>((set) => ({
  cache: {},
  setCache: (slug, data) =>
    set((state) => ({
      cache: { ...state.cache, [slug]: data },
    })),
}));
