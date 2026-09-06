import React, { useState, useId } from "react";
import styles from "./incident-escalation-tree.module.css";

export type NotificationChannelType = "push" | "sms" | "phone" | "email" | "webhook";
export type ResponderStatus = "on_call" | "backup" | "acknowledged" | "offline";
export type TierEscalationStatus = "waiting" | "paging" | "acknowledged" | "escalated" | "resolved";

export interface EscalationResponder {
  id: string;
  name: string;
  role: string;
  status: ResponderStatus;
  channels: NotificationChannelType[];
  avatarText?: string;
}

export interface EscalationTier {
  id: string;
  tierNumber: number;
  name: string;
  timeoutMinutes: number;
  status: TierEscalationStatus;
  responders: EscalationResponder[];
}

export interface IncidentEscalationTreeProps {
  /** Title of the policy or incident escalation ladder */
  title?: string;
  /** Escalation tiers ordered chronologically */
  tiers: EscalationTier[];
  /** Overall incident policy state */
  policyStatus?: "standby" | "active" | "escalated" | "resolved";
  /** Currently active tier index (0-indexed) */
  activeTierIndex?: number;
  /** Callback when a responder or tier is manually acknowledged */
  onAcknowledgeTier?: (tierId: string) => void;
  /** Callback to trigger immediate manual escalation to the next tier */
  onEscalateNow?: (currentTierId: string) => void;
  /** Density setting */
  density?: "compact" | "comfortable";
  /** Custom class */
  className?: string;
}

export const IncidentEscalationTree: React.FC<IncidentEscalationTreeProps> = ({
  title = "Incident Escalation Policy",
  tiers,
  policyStatus = "standby",
  activeTierIndex = 0,
  onAcknowledgeTier,
  onEscalateNow,
  density = "compact",
  className = "",
}) => {
  const [selectedTierId, setSelectedTierId] = useState<string>(
    tiers[activeTierIndex]?.id || tiers[0]?.id || ""
  );
  const headingId = useId();

  const selectedTier = tiers.find((t) => t.id === selectedTierId) || tiers[0];

  const getStatusBadgeClass = (status: TierEscalationStatus) => {
    switch (status) {
      case "paging":
        return styles.badgePaging;
      case "acknowledged":
        return styles.badgeAck;
      case "escalated":
        return styles.badgeEscalated;
      case "resolved":
        return styles.badgeResolved;
      default:
        return styles.badgeWaiting;
    }
  };

  const getChannelIcon = (ch: NotificationChannelType) => {
    switch (ch) {
      case "push":
        return "📱";
      case "phone":
        return "📞";
      case "sms":
        return "💬";
      case "email":
        return "✉️";
      case "webhook":
        return "⚡";
    }
  };

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBadge} aria-hidden="true">🚨</div>
          <div>
            <h2 id={headingId} className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>
              Deterministic multi-tier on-call escalation chain with SLA fallback timers.
            </p>
          </div>
        </div>
        <div className={styles.statusGroup}>
          <span className={`${styles.policyBadge} ${styles[`policy_${policyStatus}`]}`}>
            {policyStatus.toUpperCase()}
          </span>
        </div>
      </header>

      {/* Main Escalation Flow */}
      <div className={styles.flowLayout}>
        <ol className={styles.ladderList} aria-label="Escalation Tiers">
          {tiers.map((tier, idx) => {
            const isSelected = tier.id === selectedTierId;
            const isCurrentActive = idx === activeTierIndex && policyStatus === "active";
            const isLast = idx === tiers.length - 1;

            return (
              <li key={tier.id} className={styles.ladderItem}>
                <div
                  className={`${styles.tierCard} ${isSelected ? styles.tierCardSelected : ""} ${
                    isCurrentActive ? styles.tierCardActive : ""
                  }`}
                >
                  <div className={styles.tierHeaderRow}>
                    <span className={styles.tierNumberBadge}>Tier {tier.tierNumber}</span>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(tier.status)}`}>
                      {tier.status.toUpperCase()}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={styles.tierSelectButton}
                    onClick={() => setSelectedTierId(tier.id)}
                    aria-pressed={isSelected}
                  >
                    <h3 className={styles.tierName}>{tier.name}</h3>
                  </button>

                  <div className={styles.responderAvatars} aria-label={`${tier.responders.length} responders assigned`}>
                    {tier.responders.map((resp) => (
                      <span
                        key={resp.id}
                        className={`${styles.avatarChip} ${styles[`resp_${resp.status}`] || ""}`}
                        title={`${resp.name} (${resp.role}) - ${resp.status}`}
                      >
                        {resp.avatarText || resp.name.slice(0, 2).toUpperCase()}
                      </span>
                    ))}
                    <span className={styles.responderCount}>
                      {tier.responders.length} {tier.responders.length === 1 ? "responder" : "responders"}
                    </span>
                  </div>

                  <div className={styles.tierActions}>
                    {tier.status === "paging" && onAcknowledgeTier && (
                      <button
                        type="button"
                        className={styles.ackButton}
                        onClick={() => onAcknowledgeTier(tier.id)}
                      >
                        Acknowledge Tier
                      </button>
                    )}
                    {tier.status === "paging" && onEscalateNow && !isLast && (
                      <button
                        type="button"
                        className={styles.escalateButton}
                        onClick={() => onEscalateNow(tier.id)}
                      >
                        Escalate Next
                      </button>
                    )}
                  </div>
                </div>

                {/* Connecting Arrow & Timeout Badge */}
                {!isLast && (
                  <div className={styles.connector} aria-hidden="true">
                    <div className={styles.connectorLine} />
                    <span className={styles.timeoutBadge}>
                      ⏱️ Wait {tier.timeoutMinutes}m then escalate
                    </span>
                    <div className={styles.connectorLine} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {/* Selected Tier Inspection Panel */}
        {selectedTier && (
          <aside className={styles.detailPanel} aria-label="Tier Details">
            <div className={styles.detailHeader}>
              <h4 className={styles.detailTitle}>
                Tier {selectedTier.tierNumber}: {selectedTier.name}
              </h4>
              <span className={`${styles.statusBadge} ${getStatusBadgeClass(selectedTier.status)}`}>
                {selectedTier.status.toUpperCase()}
              </span>
            </div>

            <div className={styles.detailMeta}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Escalation SLA:</span>
                <span className={styles.metaVal}>{selectedTier.timeoutMinutes} minutes before auto-escalation</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Assigned Personnel:</span>
                <span className={styles.metaVal}>{selectedTier.responders.length} active contacts</span>
              </div>
            </div>

            <h5 className={styles.respondersHeading}>On-Call Personnel & Dispatch Matrix</h5>
            <ul className={styles.responderList}>
              {selectedTier.responders.map((resp) => (
                <li key={resp.id} className={styles.responderItem}>
                  <div className={styles.responderMain}>
                    <div className={styles.responderInfo}>
                      <span className={styles.responderName}>{resp.name}</span>
                      <span className={styles.responderRole}>{resp.role}</span>
                    </div>
                    <span className={`${styles.contactBadge} ${styles[`resp_${resp.status}`]}`}>
                      {resp.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>

                  <div className={styles.channelRow}>
                    <span className={styles.channelLabel}>Alert Channels:</span>
                    <div className={styles.channelIcons}>
                      {resp.channels.map((ch) => (
                        <span
                          key={ch}
                          className={styles.channelChip}
                          title={`Dispatched via ${ch}`}
                        >
                          {getChannelIcon(ch)} {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </section>
  );
};
