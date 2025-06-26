import { useCallback, useEffect, useRef, useState } from "react";

export const useIntersectionObserver = () => {
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set());

  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedElements = useRef<Map<number, Element>>(new Map());

  const observe = useCallback((element: Element, pageNumber: number) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const pageNum = parseInt(
              entry.target.getAttribute("data-page") || "0"
            );
            if (entry.isIntersecting) {
              setVisiblePages((prev) => new Set(prev).add(pageNum));
            } else {
              setVisiblePages((prev) => {
                const newSet = new Set(prev);
                newSet.delete(pageNum);
                return newSet;
              });
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "100px 0px",
        }
      );
    }

    element.setAttribute("data-page", pageNumber.toString());
    observerRef.current.observe(element);
    observedElements.current.set(pageNumber, element);
  }, []);

  const unobserve = useCallback((pageNumber: number) => {
    const element = observedElements.current.get(pageNumber);
    if (element && observerRef.current) {
      observerRef.current.unobserve(element);
      observedElements.current.delete(pageNumber);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { visiblePages, observe, unobserve };
};