"use client";

import {
  forwardRef,
  type ReactNode,
  type DragEvent,
  type ForwardedRef,
  type Ref,
  type ReactElement,
} from "react";
import styles from "./kanban-board.module.css";

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

export interface KanbanBoardProps<T extends KanbanItem> {
  columns: KanbanColumn[];
  items: T[];
  renderCard: (item: T) => ReactNode;
  onCardMove?: (itemId: string, fromColumn: string, toColumn: string) => void;
}

function KanbanBoardInner<T extends KanbanItem>(
  {
    columns,
    items,
    renderCard,
    onCardMove,
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
    <div ref={ref} className={styles.board} role="region" aria-label="Kanban Board">
      {columns.map((col) => {
        const colItems = items.filter((i) => i.columnKey === col.key);
        return (
          <div
            key={col.key}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.key)}
            className={styles.column}
          >
            {/* Column Header */}
            <div className={styles.columnHeader}>
              <div className={styles.headerLeft}>
                <div
                  className={styles.statusDot}
                  style={{ background: col.color || "var(--color-brand, #3b82f6)" }}
                />
                <span className={styles.columnTitle}>{col.title}</span>
              </div>
              <span className={styles.itemCount}>{colItems.length}</span>
            </div>

            {/* Column Body */}
            <div className={styles.columnBody}>
              {colItems.length === 0 ? (
                <div className={styles.emptyColumn}>Drop items here</div>
              ) : (
                colItems.map((item) => (
                  <div
                    key={item.id}
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
 *
 * @maturity stable
 */
export const KanbanBoard = forwardRef(KanbanBoardInner) as <T extends KanbanItem = KanbanItem>(
  props: KanbanBoardProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement | null;

(KanbanBoard as unknown as { displayName: string }).displayName = "KanbanBoard";
