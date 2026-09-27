"use client";

import { useEffect, useRef } from "react";

export interface ShortcutDefinition {
  id: string;
  keys: string; // e.g. "Ctrl+K", "g d", "?", "Shift+Tab"
  description: string;
  category: "Global" | "Navigation" | "Data Grid" | "Editing" | "Actions";
  handler: (e: KeyboardEvent) => void;
  allowInInputs?: boolean;
  disabled?: boolean;
}

// Global registry for cheat sheet discovery
const shortcutRegistry = new Map<string, ShortcutDefinition>();

export function getRegisteredShortcuts(): ShortcutDefinition[] {
  return Array.from(shortcutRegistry.values()).filter((s) => !s.disabled);
}

function isInputFocused(): boolean {
  if (typeof document === "undefined") return false;
  const active = document.activeElement;
  if (!active) return false;
  const tag = active.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    active.getAttribute("contenteditable") === "true"
  );
}

export function useKeyboardShortcuts(shortcuts: ShortcutDefinition[]): void {
  const chordBufferRef = useRef<string[]>([]);
  const chordTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Register in global map
    for (const shortcut of shortcuts) {
      shortcutRegistry.set(shortcut.id, shortcut);
    }

    return () => {
      for (const shortcut of shortcuts) {
        shortcutRegistry.delete(shortcut.id);
      }
    };
  }, [shortcuts]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const inputActive = isInputFocused();

      for (const shortcut of shortcuts) {
        if (shortcut.disabled) continue;
        if (inputActive && !shortcut.allowInInputs) continue;

        const spec = shortcut.keys.trim().toLowerCase();

        // Check for 2-key chord like "g d"
        if (spec.includes(" ")) {
          const parts = spec.split(" ");
          const firstKey = parts[0];
          const secondKey = parts[1];

          if (chordBufferRef.current.length === 0 && e.key.toLowerCase() === firstKey) {
            chordBufferRef.current.push(firstKey);
            if (chordTimeoutRef.current) clearTimeout(chordTimeoutRef.current);
            chordTimeoutRef.current = setTimeout(() => {
              chordBufferRef.current = [];
            }, 1000);
            return;
          }

          if (
            chordBufferRef.current.length === 1 &&
            chordBufferRef.current[0] === firstKey &&
            e.key.toLowerCase() === secondKey
          ) {
            e.preventDefault();
            chordBufferRef.current = [];
            if (chordTimeoutRef.current) clearTimeout(chordTimeoutRef.current);
            shortcut.handler(e);
            return;
          }
        } else {
          // Standard single or modifier key combination
          const parts = spec.split("+").map((p) => p.trim());
          const hasCtrl = parts.includes("ctrl") || parts.includes("cmd") || parts.includes("meta");
          const hasAlt = parts.includes("alt");
          const hasShift = parts.includes("shift");
          const mainKey = parts.find((p) => !["ctrl", "cmd", "meta", "alt", "shift"].includes(p));

          const ctrlPressed = e.ctrlKey || e.metaKey;
          const altPressed = e.altKey;
          const shiftPressed = e.shiftKey;

          if (hasCtrl !== ctrlPressed) continue;
          if (hasAlt !== altPressed) continue;
          if (hasShift !== shiftPressed) continue;

          if (mainKey && (e.key.toLowerCase() === mainKey || e.code.toLowerCase() === mainKey)) {
            e.preventDefault();
            shortcut.handler(e);
            return;
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (chordTimeoutRef.current) clearTimeout(chordTimeoutRef.current);
    };
  }, [shortcuts]);
}
