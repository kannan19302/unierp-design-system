"use client";

import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import styles from "./impersonation-banner.module.css";

export interface ImpersonationBannerProps {
  tenantName?: string;
  onEndImpersonation?: () => void;
  className?: string;
}

export function ImpersonationBanner({
  tenantName: propTenantName,
  onEndImpersonation,
  className = "",
}: ImpersonationBannerProps) {
  const [tenantName, setTenantName] = useState<string | null>(propTenantName ?? null);

  useEffect(() => {
    if (propTenantName !== undefined) {
      setTenantName(propTenantName);
      return;
    }

    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("unierp_impersonated_tenant");
      setTenantName(stored);
    }
  }, [propTenantName]);

  const handleEnd = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("unierp_impersonated_tenant");
      sessionStorage.removeItem("unierp_impersonated_tenant_id");
    }
    setTenantName(null);
    onEndImpersonation?.();
  };

  if (!tenantName) return null;

  return (
    <div
      className={`${styles.banner} ${className}`}
      role="alert"
      aria-label="Tenant Impersonation Warning"
    >
      <div className={styles.left}>
        <AlertTriangle size={16} className={styles.warningIcon} />
        <span>
          You are currently impersonating tenant:{" "}
          <span className={styles.tenantName}>{tenantName}</span>. All actions will be logged under
          your provider identity with an immutable audit trail.
        </span>
      </div>
      <button type="button" className={styles.endButton} onClick={handleEnd}>
        End Impersonation
      </button>
    </div>
  );
}
