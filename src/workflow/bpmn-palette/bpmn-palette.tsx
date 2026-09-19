"use client";

import {
  forwardRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type ReactNode,
} from "react";
import styles from "./bpmn-palette.module.css";

export interface BpmnPaletteItem {
  id: string;
  name: string;
  category: "events" | "activities" | "gateways" | "data";
  description: string;
  icon?: ReactNode;
}

export interface BpmnPaletteProps {
  /** Callback when user starts dragging an item onto the BPMN canvas */
  onDragStartNode?: (item: BpmnPaletteItem, event: DragEvent<HTMLDivElement>) => void;
  /** Callback when an item is selected or clicked */
  onSelectNode?: (item: BpmnPaletteItem) => void;
  /** Custom items list (defaults to standard BPMN 2.0 elements) */
  items?: BpmnPaletteItem[];
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_BPMN_ITEMS: BpmnPaletteItem[] = [
  // Events
  { id: "bpmn-start-event", name: "Start Event", category: "events", description: "Signals process initiation" },
  { id: "bpmn-timer-event", name: "Timer Event", category: "events", description: "Triggers on cron schedule or duration delay" },
  { id: "bpmn-message-event", name: "Message Event", category: "events", description: "Receives an incoming message payload" },
  { id: "bpmn-end-event", name: "End Event", category: "events", description: "Terminates the execution path" },
  // Activities
  { id: "bpmn-user-task", name: "User Task", category: "activities", description: "Human task requiring approval or manual input" },
  { id: "bpmn-service-task", name: "Service Task", category: "activities", description: "Automated API, database or microservice call" },
  { id: "bpmn-script-task", name: "Script Task", category: "activities", description: "Executes client/server TypeScript logic" },
  { id: "bpmn-business-rule", name: "Business Rule", category: "activities", description: "Evaluates DMN decision table or policy rule" },
  // Gateways
  { id: "bpmn-exclusive-gateway", name: "Exclusive (XOR)", category: "gateways", description: "Diverges into exactly one condition branch" },
  { id: "bpmn-parallel-gateway", name: "Parallel (AND)", category: "gateways", description: "Forks execution concurrently into all branches" },
  { id: "bpmn-inclusive-gateway", name: "Inclusive (OR)", category: "gateways", description: "Forks into one or more condition branches" },
  // Data
  { id: "bpmn-data-store", name: "Data Store", category: "data", description: "Persistent PostgreSQL / transactional store" },
  { id: "bpmn-data-object", name: "Data Object", category: "data", description: "In-flight payload or typed DTO" },
];

const CATEGORY_TITLES: Record<string, string> = {
  events: "Events",
  activities: "Activities & Tasks",
  gateways: "Gateways",
  data: "Data & Storage",
};

/**
 * `<BpmnPalette>` — Left-rail node palette for BPMN 2.0 Process Designers.
 *
 * @maturity stable
 */
export const BpmnPalette = forwardRef<HTMLDivElement, BpmnPaletteProps>(
  (
    {
      onDragStartNode,
      onSelectNode,
      items = DEFAULT_BPMN_ITEMS,
      className,
      style,
    },
    ref,
  ) => {
    const [search, setSearch] = useState("");

    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()),
    );

    const categories = ["events", "activities", "gateways", "data"] as const;

    const handleDragStart = (item: BpmnPaletteItem) => (e: DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData("application/bpmn-type", item.id);
      e.dataTransfer.effectAllowed = "copy";
      onDragStartNode?.(item, e);
    };

    const containerClasses = [styles.palette, className ?? ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={style}
        role="region"
        aria-label="BPMN 2.0 Process Elements Palette"
      >
        <div className={styles.header}>
          <h3 className={styles.title}>BPMN Elements</h3>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search elements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Filter BPMN elements"
          />
        </div>

        <div className={styles.categoryList}>
          {categories.map((cat) => {
            const catItems = filteredItems.filter((i) => i.category === cat);
            if (catItems.length === 0) return null;

            return (
              <div key={cat} className={styles.categoryGroup}>
                <h4 className={styles.categoryTitle}>{CATEGORY_TITLES[cat]}</h4>
                <div className={styles.itemsGrid} role="list">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      role="listitem"
                      tabIndex={0}
                      draggable
                      onDragStart={handleDragStart(item)}
                      onClick={() => onSelectNode?.(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectNode?.(item);
                        }
                      }}
                      className={styles.nodeItem}
                      title={item.description}
                      aria-label={`${item.name}: ${item.description}`}
                    >
                      <div className={styles.nodeIcon}>
                        {cat === "events" && (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                        {cat === "activities" && (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect width="20" height="16" x="2" y="4" rx="3" />
                          </svg>
                        )}
                        {cat === "gateways" && (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 22 12 12 22 2 12" />
                          </svg>
                        )}
                        {cat === "data" && (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <ellipse cx="12" cy="5" rx="9" ry="3" />
                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                          </svg>
                        )}
                      </div>
                      <span className={styles.nodeName}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

BpmnPalette.displayName = "BpmnPalette";
