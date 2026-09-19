"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import styles from "./studio-canvas.module.css";

/**
 * `<StudioCanvas>` — the artefact surface, and the one place selection lives.
 *
 * @maturity stable
 *
 * Two variants, because the platform's builders are two different shapes:
 *
 *   `linear`  — forms, rule sets, queries. Reads top to bottom, no zoom, and
 *               a bounded measure so fields stay readable.
 *   `spatial` — flows, BPMN, pages, dashboards. Owns its full area; the
 *               embedded library (`@xyflow/react`, `react-grid-layout`) keeps
 *               its own zoom and pan.
 *
 * Accessibility is the reason selection is centralised here rather than left
 * to each builder: a `<div>` full of draggable `<div>`s announces nothing at
 * all.
 *
 * The role is `group` by default and `listbox` only when the builder opts in.
 */

export interface StudioCanvasContextValue {
  selectedId: string | null;
  select: (id: string | null) => void;
  /** The ids the canvas can traverse, in visual order. */
  ids: string[];
  setIds: (ids: string[]) => void;
}

const StudioCanvasContext = createContext<StudioCanvasContextValue | null>(null);

export function useStudioCanvas(): StudioCanvasContextValue {
  const ctx = useContext(StudioCanvasContext);
  if (!ctx) {
    throw new Error("useStudioCanvas must be used inside <StudioCanvas>");
  }
  return ctx;
}

export interface StudioCanvasProps {
  variant?: "linear" | "spatial";
  children: ReactNode;
  /** Announced as the canvas label, e.g. "Contact form layout". */
  label: string;
  /** Shown instead of `children` when the artefact has nothing in it yet. */
  empty?: ReactNode;
  /** Whether the artefact is empty. Explicit, so an empty array of one kind
   *  of element does not hide a canvas that legitimately has others. */
  isEmpty?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  /**
   * `listbox` only if every selectable child renders `role="option"` with an
   * `id` matching what is registered through `setIds`. Otherwise leave it.
   */
  selectionRole?: "group" | "listbox";
  /** Optional selection overlay such as bounding box handles */
  selectionOverlay?: ReactNode;
  /** Optional bottom dock such as data query or simulation results console */
  bottomDock?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const StudioCanvas = forwardRef<HTMLDivElement, StudioCanvasProps>(
  (
    {
      variant = "linear",
      children,
      label,
      empty,
      isEmpty = false,
      selectedId: controlledId,
      onSelect,
      selectionRole = "group",
      selectionOverlay,
      bottomDock,
      className,
      style,
    },
    ref,
  ) => {
    const [uncontrolledId, setUncontrolledId] = useState<string | null>(null);
    const [ids, setIds] = useState<string[]>([]);

    const selectedId = controlledId !== undefined ? controlledId : uncontrolledId;

    const select = useCallback(
      (id: string | null) => {
        if (controlledId === undefined) setUncontrolledId(id);
        onSelect?.(id);
      },
      [controlledId, onSelect],
    );

    const ctx = useMemo(
      () => ({ selectedId, select, ids, setIds }),
      [selectedId, select, ids],
    );

    const onKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
          e.preventDefault();
          select(null);
          return;
        }
        if (ids.length === 0) return;
        const at = selectedId ? ids.indexOf(selectedId) : -1;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          select(ids[(at + 1) % ids.length] ?? null);
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          select(ids[(at - 1 + ids.length) % ids.length] ?? null);
        }
      },
      [ids, selectedId, select],
    );

    const canvasClasses = [
      styles.canvas,
      variant === "spatial" ? styles.spatial : styles.linear,
      styles.surface,
      bottomDock ? styles.hasBottomDock : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <StudioCanvasContext.Provider value={ctx}>
        <div
          ref={ref}
          className={canvasClasses}
          style={style}
          role={selectionRole}
          aria-label={label}
          aria-activedescendant={
            selectionRole === "listbox" ? (selectedId ?? undefined) : undefined
          }
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          {isEmpty && empty ? (
            <div className={styles.empty}>{empty}</div>
          ) : (
            <div className={styles.canvasBody}>
              {children}
              {selectionOverlay && (
                <div className={styles.overlayLayer} aria-hidden="true">
                  {selectionOverlay}
                </div>
              )}
            </div>
          )}
          {bottomDock && <div className={styles.bottomDock}>{bottomDock}</div>}
        </div>
      </StudioCanvasContext.Provider>
    );
  },
);

StudioCanvas.displayName = "StudioCanvas";
