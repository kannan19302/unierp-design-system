"use client";

import {
  forwardRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import styles from "./wysiwyg-canvas.module.css";

export type DeviceViewportMode = "desktop" | "tablet" | "mobile";

export interface SelectedElementMeta {
  id: string;
  name: string;
  width?: number | string;
  height?: number | string;
}

export interface WysiwygCanvasProps {
  /** Responsive preview mode */
  deviceMode?: DeviceViewportMode;
  /** Zoom percentage e.g. 100, 75, 50 */
  zoom?: number;
  /** Currently selected element metadata for rendering the bounding box */
  selectedElement?: SelectedElementMeta | null;
  /** Callback when element selection changes or is cleared via Escape */
  onSelectElement?: (id: string | null) => void;
  /** Callback when the duplicate quick action is triggered */
  onDuplicateElement?: (id: string) => void;
  /** Callback when the delete quick action is triggered */
  onDeleteElement?: (id: string) => void;
  /** Accessible label for the canvas */
  label?: string;
  /** Custom canvas content */
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const VIEWPORT_WIDTHS: Record<DeviceViewportMode, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

/**
 * `<WysiwygCanvas>` — Visual responsive builder canvas with live selection bounding ring,
 * resize handles, element badge, and quick action bar.
 *
 * @maturity stable
 */
export const WysiwygCanvas = forwardRef<HTMLDivElement, WysiwygCanvasProps>(
  (
    {
      deviceMode = "desktop",
      zoom = 100,
      selectedElement,
      onSelectElement,
      onDuplicateElement,
      onDeleteElement,
      label = "Visual page builder canvas",
      children,
      className,
      style,
    },
    ref,
  ) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape" && selectedElement) {
        e.preventDefault();
        onSelectElement?.(null);
      } else if (e.key === "Delete" && selectedElement) {
        e.preventDefault();
        onDeleteElement?.(selectedElement.id);
      }
    };

    const containerClasses = [styles.canvasContainer, className ?? ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={style}
        role="region"
        aria-label={label}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div
          className={`${styles.viewportFrame} ${styles[deviceMode]}`}
          style={{
            maxWidth: VIEWPORT_WIDTHS[deviceMode],
            transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
            transformOrigin: "top center",
          }}
        >
          <div className={styles.viewportContent}>{children}</div>

          {selectedElement && (
            <div
              className={styles.selectionOverlay}
              aria-label={`Selected element: ${selectedElement.name}`}
            >
              <div className={styles.selectionTag}>
                <span className={styles.tagName}>{selectedElement.name}</span>
                {selectedElement.width && selectedElement.height && (
                  <span className={styles.tagDims}>
                    {selectedElement.width} × {selectedElement.height}
                  </span>
                )}
                <div className={styles.quickActions}>
                  {onDuplicateElement && (
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => onDuplicateElement(selectedElement.id)}
                      aria-label="Duplicate element"
                      title="Duplicate"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    </button>
                  )}
                  {onDeleteElement && (
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => onDeleteElement(selectedElement.id)}
                      aria-label="Delete element"
                      title="Delete"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* 8 resize handle anchors */}
              <span className={`${styles.handle} ${styles.tl}`} aria-hidden="true" />
              <span className={`${styles.handle} ${styles.tc}`} aria-hidden="true" />
              <span className={`${styles.handle} ${styles.tr}`} aria-hidden="true" />
              <span className={`${styles.handle} ${styles.ml}`} aria-hidden="true" />
              <span className={`${styles.handle} ${styles.mr}`} aria-hidden="true" />
              <span className={`${styles.handle} ${styles.bl}`} aria-hidden="true" />
              <span className={`${styles.handle} ${styles.bc}`} aria-hidden="true" />
              <span className={`${styles.handle} ${styles.br}`} aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
    );
  },
);

WysiwygCanvas.displayName = "WysiwygCanvas";
