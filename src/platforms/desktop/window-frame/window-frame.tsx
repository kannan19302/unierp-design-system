import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./window-frame.module.css";

export interface WindowFrameProps extends HTMLAttributes<HTMLDivElement> {
  titlebar?: ReactNode;
  sidebar?: ReactNode;
  statusBar?: ReactNode;
}

export const WindowFrame = forwardRef<HTMLDivElement, WindowFrameProps>(
  (
    {
      titlebar,
      sidebar,
      statusBar,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`${styles.frame} ${className}`}
        role="region"
        aria-label="Desktop Application Window"
        {...props}
      >
        {titlebar && <div className={styles.titlebarWrapper}>{titlebar}</div>}

        <div className={styles.body}>
          {sidebar && <div className={styles.sidebarWrapper}>{sidebar}</div>}
          <div className={styles.contentWrapper} role="region" aria-label="Window Content">{children}</div>
        </div>

        {statusBar && <div className={styles.statusWrapper} role="status">{statusBar}</div>}
      </div>
    );
  }
);

WindowFrame.displayName = "WindowFrame";
