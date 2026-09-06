import React from "react";
import styles from "./fact-box-nav-drawer.module.css";

export interface FactBoxNavMetric {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}

export interface FactBoxCard {
  id: string;
  title: string;
  badge?: string | number;
  metrics?: FactBoxNavMetric[];
  drilldownLabel?: string;
  onDrilldown?: () => void;
}

export interface FactBoxNavDrawerProps {
  cards: FactBoxCard[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  title?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

export const FactBoxNavDrawer: React.FC<FactBoxNavDrawerProps> = ({
  cards,
  isCollapsed = false,
  onToggleCollapse,
  title = "FactBox Telemetry",
  density = "standard",
  className = "",
  testId = "fact-box-nav-drawer",
}) => {
  return (
    <aside
      className={`${styles.drawerContainer ?? ""} ${isCollapsed ? (styles.drawerCollapsed ?? "") : ""} ${className}`}
      data-density={density}
      data-testid={testId}
      aria-label={title}
    >
      <div className={styles.header ?? ""}>
        {!isCollapsed && <h4 className={styles.title ?? ""}>{title}</h4>}
        {onToggleCollapse && (
          <button
            type="button"
            className={styles.toggleBtn ?? ""}
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand FactBox drawer" : "Collapse FactBox drawer"}
          >
            {isCollapsed ? "◨" : "✕"}
          </button>
        )}
      </div>

      {!isCollapsed && (
        <ul className={styles.cardsList ?? ""} role="list">
          {cards.map((card) => (
            <li key={card.id}>
              <div className={styles.factCard ?? ""}>
                <div className={styles.cardHeader ?? ""}>
                  <h5 className={styles.cardTitle ?? ""}>{card.title}</h5>
                  {card.badge !== undefined && (
                    <span className={styles.badge ?? ""}>{card.badge}</span>
                  )}
                </div>

                {card.metrics && card.metrics.length > 0 && (
                  <div className={styles.metricsGrid ?? ""}>
                    {card.metrics.map((m, idx) => (
                      <div key={idx} className={styles.metricRow ?? ""}>
                        <span className={styles.metricLabel ?? ""}>{m.label}</span>
                        <span className={styles.metricValue ?? ""}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {card.drilldownLabel && card.onDrilldown && (
                  <button
                    type="button"
                    className={styles.drilldownBtn ?? ""}
                    onClick={card.onDrilldown}
                    aria-label={`Drilldown to ${card.title}`}
                  >
                    <span>{card.drilldownLabel}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};
