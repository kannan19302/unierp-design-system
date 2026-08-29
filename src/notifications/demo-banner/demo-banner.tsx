"use client";

import { type FC, useState } from "react";
import styles from "./demo-banner.module.css";

export interface DemoBannerProps {
  currentModule?: string;
  apiBase?: string;
  onRemoved?: () => void;
}

export const DemoBanner: FC<DemoBannerProps> = ({
  currentModule,
  apiBase = "/api/v1",
  onRemoved,
}) => {
  const [removing, setRemoving] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleRemove = async (module?: string) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        module
          ? `Remove demo data from ${module}? This cannot be undone.`
          : "Remove ALL demo data from the entire ERP? This cannot be undone.",
      )
    )
      return;

    setRemoving(true);
    try {
      const url = module
        ? `${apiBase}/admin/demo/remove/${module}`
        : `${apiBase}/admin/demo/remove`;
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setDismissed(true);
        onRemoved?.();
      }
    } catch {
      // silently fail
    } finally {
      setRemoving(false);
    }
  };

  return (
    <aside aria-label="Demo Data Notice" className={styles.banner}>
      <span className={styles.label}>Using demo data</span>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => handleRemove()}
          disabled={removing}
          className={styles.btnPrimary}
        >
          Remove all demo data
        </button>

        {currentModule && (
          <button
            type="button"
            onClick={() => handleRemove(currentModule)}
            disabled={removing}
            className={styles.btnOutline}
          >
            Remove from this app
          </button>
        )}
      </div>
    </aside>
  );
};
