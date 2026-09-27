"use client";

import {
  forwardRef,
  type ReactNode,
  type DragEvent,
  type ForwardedRef,
  type Ref,
  type ReactElement,
} from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./kanban-board.module.css";

export const kanbanBoardVariants = cva(styles.board, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export type KanbanBoardVariantProps = VariantProps<typeof kanbanBoardVariants>;

export interface KanbanColumn {
  key: string;
  title: string;
  color?: string;
}

export interface KanbanItem {
  id: string;
  columnKey: string;
  [key: string]: unknown;
}

export interface KanbanBoardProps<T extends KanbanItem>
  extends React.HTMLAttributes<HTMLDivElement>,
    KanbanBoardVariantProps {
  columns: KanbanColumn[];
  items: T[];
  renderCard: (item: T) => ReactNode;
  onCardMove?: (itemId: string, fromColumn: string, toColumn: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
}

function KanbanBoardInner<T extends KanbanItem>(
  {
    columns,
    items,
    renderCard,
    onCardMove,
    density = "standard",
    className = "",
    ...rest
  }: KanbanBoardProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    targetColumn: string,
  ) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    const item = items.find((i) => i.id === itemId);
    if (item && item.columnKey !== targetColumn && onCardMove) {
      onCardMove(itemId, item.columnKey, targetColumn);
    }
  };

  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    itemId: string,
  ) => {
    e.dataTransfer.setData("text/plain", itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      ref={ref}
      data-slot="kanban-board"
      data-density={density}
      className={`${kanbanBoardVariants({ density })}${className ? ` ${className}` : ""}`.trim()}
      role="region"
      aria-label="Kanban Board"
      {...rest}
    >
      {columns.map((col) => {
        const colItems = items.filter((i) => i.columnKey === col.key);
        return (
          <div
            key={col.key}
            data-slot="kanban-board-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.key)}
            className={styles.column}
          >
            {/* Column Header */}
            <div className={styles.columnHeader} data-slot="kanban-board-column-header">
              <div className={styles.headerLeft} data-slot="kanban-board-header-left">
                <div
                  className={styles.statusDot}
                  data-slot="kanban-board-status-dot"
                  style={{ background: col.color || "var(--color-brand, #3b82f6)" }}
                />
                <span className={styles.columnTitle} data-slot="kanban-board-column-title">{col.title}</span>
              </div>
              <span className={styles.itemCount} data-slot="kanban-board-item-count">{colItems.length}</span>
            </div>

            {/* Column Body */}
            <div className={styles.columnBody} data-slot="kanban-board-column-body">
              {colItems.length === 0 ? (
                <div className={styles.emptyColumn} data-slot="kanban-board-empty">Drop items here</div>
              ) : (
                colItems.map((item) => (
                  <div
                    key={item.id}
                    data-slot="kanban-board-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    className={styles.cardItem}
                  >
                    {renderCard(item)}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * KanbanBoard organizes items into draggable columns representing workflow states.
 * Follows Strata enterprise standards with cva, 4-tier density scaling, and data-slot annotations.
 *
 * @maturity stable
 */
export const KanbanBoard = forwardRef(KanbanBoardInner) as <T extends KanbanItem = KanbanItem>(
  props: KanbanBoardProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement | null;

(KanbanBoard as unknown as { displayName: string }).displayName = "KanbanBoard";
