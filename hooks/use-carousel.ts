"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal scroll-snap carousel controller: keeps track of whether the track can
 * scroll further in either direction and exposes prev/next scrollers.
 */
export function useCarousel<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const sync = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    const maxScroll = node.scrollWidth - node.clientWidth;
    setCanScrollPrev(node.scrollLeft > 4);
    setCanScrollNext(node.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    sync();
    node.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(node);
    return () => {
      node.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [sync]);

  const scrollBy = useCallback((direction: 1 | -1) => {
    const node = ref.current;
    if (!node) return;
    const first = node.firstElementChild as HTMLElement | null;
    const step = first ? first.clientWidth + 24 : node.clientWidth * 0.8;
    node.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  return { ref, canScrollPrev, canScrollNext, scrollBy };
}
