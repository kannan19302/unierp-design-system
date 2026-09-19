import React, { useState, forwardRef } from "react";
import styles from "./bottom-utility-dock-bar.module.css";

export interface BottomUtilityTool {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badgeCount?: number;
  renderPanel?: () => React.ReactNode;
  disabled?: boolean;
}

export interface BottomUtilityDockBarProps extends React.HTMLAttributes<HTMLDivElement> {
  tools: BottomUtilityTool[];
  activeToolId?: string;
  onToolChange?: (toolId: string | null) => void;
  statusText?: string;
  liveStatus?: "online" | "syncing" | "offline";
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

/**
 * BottomUtilityDockBar provides a persistent dock at the bottom of the workspace
 * with quick utility tool actions, drawer panels, and live connection status indicators.
 *
 * @maturity stable
 */
export const BottomUtilityDockBar = forwardRef<HTMLDivElement, BottomUtilityDockBarProps>(
  (
    {
      tools,
      activeToolId: controlledActiveToolId,
      onToolChange,
      statusText,
      liveStatus = "online",
      density = "standard",
      className = "",
      testId = "bottom-utility-dock-bar",
      ...rest
    },
    ref
  ) => {
    const [internalActiveToolId, setInternalActiveToolId] = useState<string | null>(null);

    const activeToolId = controlledActiveToolId !== undefined ? controlledActiveToolId : internalActiveToolId;

    const handleToolClick = (tool: BottomUtilityTool) => {
      if (tool.disabled) return;
      const nextToolId = activeToolId === tool.id ? null : tool.id;
      if (controlledActiveToolId === undefined) {
        setInternalActiveToolId(nextToolId);
      }
      onToolChange?.(nextToolId);
    };

    const handleCloseDrawer = () => {
      if (controlledActiveToolId === undefined) {
        setInternalActiveToolId(null);
      }
      onToolChange?.(null);
    };

    const activeTool = tools.find((t) => t.id === activeToolId);

    const getStatusDotClass = () => {
      switch (liveStatus) {
        case "offline":
          return styles.liveDotOffline;
        case "syncing":
          return styles.liveDotSyncing;
        case "online":
        default:
          return styles.liveDotOnline;
      }
    };

    return (
      <div
        ref={ref}
        className={`${styles.wrapper} ${className}`}
        data-density={density}
        data-testid={testId}
        {...rest}
      >
        {activeTool && activeTool.renderPanel && (
          <div
            className={styles.popupDrawer}
            role="region"
            aria-label={`${activeTool.label} panel`}
          >
            <div className={styles.drawerHeader}>
              <h4 className={styles.drawerTitle}>{activeTool.label}</h4>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={handleCloseDrawer}
                aria-label={`Close ${activeTool.label}`}
              >
                ✕
              </button>
            </div>
            <div className={styles.drawerBody}>
              {activeTool.renderPanel()}
            </div>
          </div>
        )}

        <nav className={styles.dockBar} aria-label="Bottom Utility Dock">
          <ul className={styles.toolList} role="list">
            {tools.map((tool) => {
              const isActive = activeToolId === tool.id;
              return (
                <li key={tool.id}>
                  <button
                    type="button"
                    className={`${styles.toolButton} ${isActive ? styles.toolButtonActive : ""}`}
                    onClick={() => handleToolClick(tool)}
                    disabled={tool.disabled}
                    aria-expanded={isActive}
                    aria-label={tool.label}
                  >
                    {tool.icon && <span aria-hidden="true">{tool.icon}</span>}
                    <span>{tool.label}</span>
                    {typeof tool.badgeCount === "number" && tool.badgeCount > 0 && (
                      <span className={styles.badge} aria-label={`${tool.badgeCount} notifications`}>
                        {tool.badgeCount}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {statusText && (
            <div className={styles.statusIndicator} aria-live="polite">
              <span
                className={`${styles.liveDot} ${getStatusDotClass()}`}
                aria-hidden="true"
              />
              <span>{statusText}</span>
            </div>
          )}
        </nav>
      </div>
    );
  }
);

BottomUtilityDockBar.displayName = "BottomUtilityDockBar";
