"use client";

import { useCallback, useMemo, useRef, useState } from "react";

/**
 * `useStudioDocument` — the state contract every builder implements, so that
 * undo, dirty tracking and concurrent-edit safety work the same way in all
 * thirteen of them.
 *
 * Each builder had grown its own version of this, and each was missing a
 * different piece: the form builder tracked dirty but had no undo, the flow
 * editor had undo but no dirty flag (so navigating away lost work silently),
 * and none of them carried a version, which means two people editing the same
 * artefact produced a last-write-wins overwrite with no warning.
 *
 * Three deliberate choices:
 *
 * - **Undo is a stack of whole documents, not of operations.** Builder
 *   artefacts are small JSON, and an operation log has to be maintained
 *   correctly by every builder that mutates state — which is exactly the thing
 *   we cannot rely on across thirteen of them. Snapshots are wasteful and
 *   correct; that trade is the right way round here.
 * - **The stack is bounded.** `limit` defaults to 50. An unbounded undo stack
 *   in a page builder holding image data is a memory leak with a friendly name.
 * - **`baseVersion` is carried, not inferred.** Save sends the version the
 *   edit started from, so the server can reject a stale write instead of
 *   silently clobbering someone else's.
 */

export interface StudioDocumentState<T> {
  /** The current document. */
  doc: T;
  /** Replace the document, pushing the previous value onto the undo stack. */
  update: (next: T | ((prev: T) => T)) => void;
  /** Replace without touching history — for a load, or an accepted save. */
  reset: (next: T, version?: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  /** True when `doc` differs from the last `reset`. */
  dirty: boolean;
  /** The version the current edit started from. Send this on save. */
  baseVersion: string | undefined;
  /** How many undo steps are held. Useful for a history panel. */
  historyDepth: number;
}

export interface UseStudioDocumentOptions {
  /** Max undo snapshots retained. Default 50. */
  limit?: number;
  /** Version identifier of the loaded document, for optimistic concurrency. */
  version?: string;
}

export function useStudioDocument<T>(
  initial: T,
  options: UseStudioDocumentOptions = {},
): StudioDocumentState<T> {
  const { limit = 50, version } = options;

  const [doc, setDoc] = useState<T>(initial);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);
  const [baseVersion, setBaseVersion] = useState<string | undefined>(version);

  // The clean baseline lives in a ref, not state: comparing against it must
  // not itself trigger a render, and it changes only on reset.
  const clean = useRef<T>(initial);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setDoc((prev) => {
        const value =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        if (Object.is(value, prev)) return prev;
        setPast((p) => {
          const grown = [...p, prev];
          // Drop from the FRONT: the oldest states are the ones a user is
          // least likely to want back.
          return grown.length > limit ? grown.slice(grown.length - limit) : grown;
        });
        // Any new edit invalidates the redo branch — standard, and the
        // alternative (a tree) is not something a builder UI can present.
        setFuture([]);
        return value;
      });
    },
    [limit],
  );

  const reset = useCallback((next: T, nextVersion?: string) => {
    clean.current = next;
    setDoc(next);
    setPast([]);
    setFuture([]);
    if (nextVersion !== undefined) setBaseVersion(nextVersion);
  }, []);

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const previous = p[p.length - 1] as T;
      setDoc((current) => {
        setFuture((f) => [current, ...f]);
        return previous;
      });
      return p.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0] as T;
      setDoc((current) => {
        setPast((p) => [...p, current]);
        return next;
      });
      return f.slice(1);
    });
  }, []);

  const dirty = useMemo(() => !Object.is(doc, clean.current), [doc]);

  return {
    doc,
    update,
    reset,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    dirty,
    baseVersion,
    historyDepth: past.length,
  };
}
