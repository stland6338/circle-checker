import { useState, useCallback } from "react";

const STORAGE_KEY = "ssf10-bookmarks";

function loadBookmarks(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return new Set(JSON.parse(raw) as number[]);
    }
  } catch {
    // ignore
  }
  return new Set();
}

function saveBookmarks(ids: Set<number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<number>>(loadBookmarks);

  const toggle = useCallback((id: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveBookmarks(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (id: number) => bookmarks.has(id),
    [bookmarks]
  );

  return { bookmarks, toggle, isBookmarked };
}
