import useSWR from "swr";
import { fetcher } from "@/lib/utils";

import { ImageExtractionResponse } from "@/types";
import { useReadingStore } from "@/store/readingStore";

export const useReadingData = (slug: string) => {
  const data = useReadingStore((s) => s.cache[slug]);
  const setCache = useReadingStore((s) => s.setCache);

  const { error, isLoading } = useSWR<ImageExtractionResponse>(
    data ? null : `/api/read/${slug}`,
    fetcher,
    {
      onSuccess: (newData) => {
        setCache(slug, newData);
      },
    }
  );

  return {
    data,
    isLoading,
    error,
  };
};
