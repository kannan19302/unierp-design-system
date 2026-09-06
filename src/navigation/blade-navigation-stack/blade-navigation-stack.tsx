import React, { useId, useState } from "react";
import styles from "./blade-navigation-stack.module.css";

export interface BladeItem {
  id: string;
  title: string;
  subtitle?: string;
  hasChildren?: boolean;
}

export interface NavigationBlade {
  id: string;
  title: string;
  items: BladeItem[];
  selectedItemId?: string;
  isMaximized?: boolean;
}

export const defaultBladesDemo: NavigationBlade[] = [
  {
    id: "blade_subs",
    title: "Cloud Subscriptions",
    selectedItemId: "sub_prod",
    items: [
      { id: "sub_prod", title: "Enterprise-Core-Production", subtitle: "ID: sub-8841", hasChildren: true },
      { id: "sub_dev", title: "Global-Sandbox-Dev", subtitle: "ID: sub-1029", hasChildren: true },
    ],
  },
  {
    id: "blade_rg",
    title: "Resource Groups",
    selectedItemId: "rg_ap_south",
    items: [
      { id: "rg_ap_south", title: "rg-prod-ap-south-mumbai", subtitle: "24 resources", hasChildren: true },
      { id: "rg_us_east", title: "rg-prod-us-east-virginia", subtitle: "56 resources", hasChildren: true },
    ],
  },
  {
    id: "blade_vnet",
    title: "Virtual Networks & Subnets",
    selectedItemId: "vnet_db",
    items: [
      { id: "vnet_app", title: "vnet-app-tier (10.0.1.0/24)", subtitle: "Public Load Balancer", hasChildren: false },
      { id: "vnet_db", title: "vnet-database-tier (10.0.2.0/24)", subtitle: "Private Aurora Cluster", hasChildren: true },
    ],
  },
];

export interface BladeNavigationStackProps {
  blades?: NavigationBlade[];
  onOpenItem?: (bladeIndex: number, item: BladeItem) => void;
  onCloseBlade?: (bladeIndex: number) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const BladeNavigationStack: React.FC<BladeNavigationStackProps> = ({
  blades: propBlades,
  onOpenItem,
  onCloseBlade,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [blades, setBlades] = useState<NavigationBlade[]>(propBlades || defaultBladesDemo);
  const [maximizedBladeId, setMaximizedBladeId] = useState<string | null>(null);

  const handleItemClick = (bladeIndex: number, item: BladeItem) => {
    setBlades((prev) => {
      const updated = prev.slice(0, bladeIndex + 1);
      const currentBlade = updated[bladeIndex];
      if (currentBlade) {
        currentBlade.selectedItemId = item.id;
      }
      return updated;
    });
    onOpenItem?.(bladeIndex, item);
  };

  const handleClose = (bladeIndex: number) => {
    if (bladeIndex === 0) return; // Keep at least root blade
    setBlades((prev) => prev.slice(0, bladeIndex));
    onCloseBlade?.(bladeIndex);
  };

  const handleToggleMaximize = (bladeId: string) => {
    setMaximizedBladeId((prev) => (prev === bladeId ? null : bladeId));
  };

  const handleReset = () => {
    setBlades([blades[0] || defaultBladesDemo[0]!]);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.topBar}>
        <div className={styles.breadcrumbs} aria-label="Blade Drill-Down Breadcrumb Trail">
          {blades.map((b, idx) => (
            <React.Fragment key={b.id}>
              {idx > 0 && <span className={styles.separator}>/</span>}
              <button
                type="button"
                className={`${styles.crumbItem} ${idx === blades.length - 1 ? styles.crumbActive : ""}`}
                onClick={() => setBlades((prev) => prev.slice(0, idx + 1))}
              >
                {b.title}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className={styles.stackActions}>
          <h2 id={headingId} className={styles.bladeTitle} style={{ marginRight: "0.5rem" }}>
            Azure-Grade Blade Navigator
          </h2>
          {blades.length > 1 && (
            <button
              type="button"
              className={styles.resetBtn}
              onClick={handleReset}
              aria-label="Reset drilldown to root blade"
            >
              Reset to Root
            </button>
          )}
        </div>
      </header>

      <div
        className={styles.bladeScroller}
        role="region"
        aria-label="Cascading Navigation Blade Stack"
      >
        {blades.map((blade, idx) => {
          const isMax = maximizedBladeId === blade.id;
          return (
            <article
              key={blade.id}
              className={`${styles.blade} ${isMax ? styles.bladeMaximized : ""}`}
              aria-label={`Blade ${idx + 1}: ${blade.title}`}
            >
              <header className={styles.bladeHeader}>
                <div className={styles.bladeTitleGroup}>
                  <span className={styles.bladeIndex}>{idx + 1}</span>
                  <h3 className={styles.bladeTitle}>{blade.title}</h3>
                </div>

                <div className={styles.bladeTools}>
                  <button
                    type="button"
                    className={styles.toolBtn}
                    onClick={() => handleToggleMaximize(blade.id)}
                    aria-label={isMax ? `Restore width for ${blade.title}` : `Maximize ${blade.title}`}
                    title={isMax ? "Restore" : "Maximize"}
                  >
                    {isMax ? "❐" : "⛶"}
                  </button>
                  {idx > 0 && (
                    <button
                      type="button"
                      className={styles.toolBtn}
                      onClick={() => handleClose(idx)}
                      aria-label={`Close blade: ${blade.title}`}
                      title="Close"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </header>

              <div className={styles.bladeBody}>
                <ul className={styles.itemList} role="list">
                  {blade.items.map((item) => {
                    const isSelected = item.id === blade.selectedItemId;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          className={`${styles.itemButton} ${isSelected ? styles.itemButtonSelected : ""}`}
                          onClick={() => handleItemClick(idx, item)}
                          aria-current={isSelected ? "page" : undefined}
                        >
                          <div>
                            <div>{item.title}</div>
                            {item.subtitle && (
                              <div style={{ fontSize: "0.6875rem", color: "var(--color-text-secondary, #64748b)" }}>
                                {item.subtitle}
                              </div>
                            )}
                          </div>
                          {item.hasChildren && (
                            <span className={styles.itemArrow} aria-hidden="true">
                              ›
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
