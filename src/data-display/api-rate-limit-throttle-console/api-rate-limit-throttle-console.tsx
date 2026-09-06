import React, { useId, useState, useMemo } from "react";
import styles from "./api-rate-limit-throttle-console.module.css";

export type RateLimitTier = "tier_standard" | "tier_pro" | "tier_enterprise" | "tier_internal";

export interface TenantApiQuota {
  tenantId: string; // "cust_8910a"
  tenantName: string; // "Stripe Global Logistics"
  apiKeyPrefix: string; // "pk_live_51M..."
  tier: RateLimitTier;
  currentRps: number; // 48
  limitRps: number; // 100
  burstLimit: number; // 150
  dailyUsageRequests: number; // 420,000
  dailyLimitRequests: number; // 1,000,000
  throttled429Count: number; // 12
  isWhitelisted?: boolean;
}

export interface ApiRateLimitThrottleConsoleProps {
  gatewayHost?: string; // "api.gateway.unierp.io"
  activeWindowMinutes?: number; // 60
  quotas: TenantApiQuota[];
  onToggleWhitelist?: (tenantId: string, whitelisted: boolean) => void;
  onSelectTenant?: (tenant: TenantApiQuota) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ApiRateLimitThrottleConsole: React.FC<ApiRateLimitThrottleConsoleProps> = ({
  gatewayHost = "api.gateway.unierp.io",
  activeWindowMinutes = 60,
  quotas,
  onToggleWhitelist,
  onSelectTenant,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [selectedTenantId, setSelectedTenantId] = useState<string>(
    quotas[0]?.tenantId ?? ""
  );

  const selectedTenant = useMemo(() => {
    return quotas.find((q) => q.tenantId === selectedTenantId) ?? quotas[0] ?? null;
  }, [quotas, selectedTenantId]);

  const total429s = useMemo(() => {
    return quotas.reduce((sum, q) => sum + q.throttled429Count, 0);
  }, [quotas]);

  const totalRps = useMemo(() => {
    return quotas.reduce((sum, q) => sum + q.currentRps, 0);
  }, [quotas]);

  const getTierBadge = (tier: RateLimitTier) => {
    switch (tier) {
      case "tier_enterprise":
        return <span className={`${styles.tierBadge} ${styles.tierEnterprise}`}>Enterprise</span>;
      case "tier_pro":
        return <span className={`${styles.tierBadge} ${styles.tierPro}`}>Pro Tier</span>;
      case "tier_internal":
        return <span className={`${styles.tierBadge} ${styles.tierInternal}`}>Internal Mesh</span>;
      default:
        return <span className={`${styles.tierBadge} ${styles.tierStandard}`}>Standard</span>;
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.metaGroup}>
          <div className={styles.taglineRow}>
            <span className={styles.gatewayBadge}>API GATEWAY GUARD</span>
            <span className={styles.gatewayHostText}>{gatewayHost}</span>
          </div>
          <h2 id={headingId} className={styles.title}>
            API Rate Limit & Token Bucket Throttling Console
          </h2>
          <p className={styles.subtitle}>
            Enforcing token replenishment, burst capacity & tenant isolation ({activeWindowMinutes}m rolling window)
          </p>
        </div>

        <div className={styles.kpiRow}>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Global Traffic</span>
            <strong className={styles.kpiValue}>{totalRps.toLocaleString()} RPS</strong>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>HTTP 429 Throttles</span>
            <strong
              className={`${styles.kpiValue} ${
                total429s > 0 ? styles.alertText : ""
              }`}
            >
              {total429s.toLocaleString()} Throttled
            </strong>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Monitored Tenants</span>
            <strong className={styles.kpiValue}>{quotas.length}</strong>
          </div>
        </div>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Tenant API Quotas and Rate Limits">
          <caption className={styles.srOnly}>
            API consumer rate limits, current RPS usage, token burst allowances, and 429 throttle events
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.thLeft}>Tenant / Organization</th>
              <th scope="col" className={styles.thCenter}>Tier</th>
              <th scope="col" className={styles.thRight}>Current RPS</th>
              <th scope="col" className={styles.thRight}>Limit / Burst</th>
              <th scope="col" className={styles.thLeft}>Daily Quota Consumption</th>
              <th scope="col" className={styles.thRight}>429 Drops</th>
              <th scope="col" className={styles.thCenter}>Exemption</th>
              <th scope="col" className={styles.thCenter}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotas.map((q) => {
              const isSelected = selectedTenant?.tenantId === q.tenantId;
              const usagePercent = Math.min(100, Math.round((q.dailyUsageRequests / q.dailyLimitRequests) * 100));
              const rpsPercent = Math.min(100, Math.round((q.currentRps / q.limitRps) * 100));

              return (
                <tr
                  key={q.tenantId}
                  className={`${styles.row} ${isSelected ? styles.rowSelected : ""}`}
                  onClick={() => {
                    setSelectedTenantId(q.tenantId);
                    onSelectTenant?.(q);
                  }}
                >
                  <td className={styles.tdLeft}>
                    <strong className={styles.tenantName}>{q.tenantName}</strong>
                    <span className={styles.keyPrefix}>{q.apiKeyPrefix}</span>
                  </td>
                  <td className={styles.tdCenter}>{getTierBadge(q.tier)}</td>
                  <td className={styles.tdRight}>
                    <strong className={rpsPercent > 90 ? styles.alertText : ""}>
                      {q.currentRps} RPS
                    </strong>
                  </td>
                  <td className={styles.tdRight}>
                    <span className={styles.limitText}>
                      {q.limitRps} / {q.burstLimit} RPS
                    </span>
                  </td>
                  <td className={styles.tdLeft}>
                    <div className={styles.quotaBarWrapper}>
                      <div className={styles.quotaBarTrack}>
                        <div
                          className={`${styles.quotaBarFill} ${
                            usagePercent > 90
                              ? styles.fillDanger
                              : usagePercent > 75
                              ? styles.fillWarning
                              : styles.fillNormal
                          }`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                      <span className={styles.quotaPct}>
                        {usagePercent}% ({Math.round(q.dailyUsageRequests / 1000)}k /{" "}
                        {Math.round(q.dailyLimitRequests / 1000)}k)
                      </span>
                    </div>
                  </td>
                  <td className={styles.tdRight}>
                    {q.throttled429Count > 0 ? (
                      <span className={styles.badge429}>+{q.throttled429Count}</span>
                    ) : (
                      <span className={styles.zeroDrops}>0</span>
                    )}
                  </td>
                  <td className={styles.tdCenter}>
                    {q.isWhitelisted ? (
                      <span className={styles.whitelistedTag}>Whitelisted</span>
                    ) : (
                      <span className={styles.throttledTag}>Throttled</span>
                    )}
                  </td>
                  <td className={styles.tdCenter}>
                    <button
                      type="button"
                      className={styles.toggleBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWhitelist?.(q.tenantId, !q.isWhitelisted);
                      }}
                      aria-label={`${q.isWhitelisted ? "Revoke whitelist for" : "Whitelist"} ${q.tenantName}`}
                    >
                      {q.isWhitelisted ? "Revoke" : "Bypass"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
