"use client";

import { useEffect, useState, useCallback, type RefObject } from "react";

export interface UseVimNavigationOptions {
  itemCount: number;
  initialIndex?: number;
  enabled?: boolean;
  onSelect?: (index: number) => void;
  onToggleSelect?: (index: number) => void;
  searchInputRef?: RefObject<HTMLInputElement | null>;
}

export interface UseVimNavigationReturn {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  selectedIndices: Set<number>;
  toggleSelect: (index: number) => void;
  clearSelection: () => void;
  selectAll: () => void;
}

export function useVimNavigation({
  itemCount,
  initialIndex = 0,
  enabled = true,
  onSelect,
  onToggleSelect,
  searchInputRef,
}: UseVimNavigationOptions): UseVimNavigationReturn {
  const [focusedIndex, setFocusedIndex] = useState<number>(initialIndex);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  const toggleSelect = useCallback(
    (index: number) => {
      setSelectedIndices((prev) => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        return next;
      });
      onToggleSelect?.(index);
    },
    [onToggleSelect]
  );

  const clearSelection = useCallback(() => {
    setSelectedIndices(new Set());
  }, []);

  const selectAll = useCallback(() => {
    const all = new Set<number>();
    for (let i = 0; i < itemCount; i++) {
      all.add(i);
    }
    setSelectedIndices(all);
  }, [itemCount]);

  useEffect(() => {
    if (!enabled || itemCount === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInput =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.tagName === "SELECT" ||
          active.getAttribute("contenteditable") === "true");

      if (isInput) {
        if (e.key === "Escape") {
          (active as HTMLElement).blur();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case "j":
        case "arrowdown":
          e.preventDefault();
          setFocusedIndex((prev) => Math.min(prev + 1, itemCount - 1));
          break;

        case "k":
        case "arrowup":
          e.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          break;

        case "x":
        case " ":
          e.preventDefault();
          toggleSelect(focusedIndex);
          break;

        case "o":
        case "enter":
          e.preventDefault();
          onSelect?.(focusedIndex);
          break;

        case "/":
          if (searchInputRef?.current) {
            e.preventDefault();
            searchInputRef.current.focus();
          }
          break;

        case "escape":
          e.preventDefault();
          clearSelection();
          break;

        case "*":
          e.preventDefault();
          selectAll();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    enabled,
    itemCount,
    focusedIndex,
    toggleSelect,
    onSelect,
    clearSelection,
    selectAll,
    searchInputRef,
  ]);

  return {
    focusedIndex,
    setFocusedIndex,
    selectedIndices,
    toggleSelect,
    clearSelection,
    selectAll,
  };
}
