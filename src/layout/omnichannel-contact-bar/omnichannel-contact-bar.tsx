import React, { useId, useState } from "react";
import styles from "./omnichannel-contact-bar.module.css";

export type AgentTelephonyState = "available" | "in_call" | "wrap_up" | "paused";

export interface CallerProfile {
  callerNumber: string;
  customerName: string;
  accountReference: string;
  serviceTier: string; // e.g. "Diamond SLA 24/7"
}

export interface OmnichannelContactBarProps {
  initialState?: AgentTelephonyState;
  activeCaller?: CallerProfile;
  callDurationSeconds?: number;
  dispositionOptions?: string[];
  onStateChange?: (newState: AgentTelephonyState) => void;
  onEndCall?: () => void;
  onTransferCall?: (targetQueue: string) => void;
  onSubmitDisposition?: (disposition: string, notes: string) => void;
  variant?: "docked" | "floating";
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const OmnichannelContactBar: React.FC<OmnichannelContactBarProps> = ({
  initialState = "in_call",
  activeCaller = {
    callerNumber: "+1 (415) 890-2134",
    customerName: "AeroDynamics Propulsion Corp",
    accountReference: "ACC-88201",
    serviceTier: "Mission-Critical 24/7",
  },
  callDurationSeconds = 258, // 4m 18s
  dispositionOptions = [
    "Resolved - First Contact Resolution",
    "Escalated - Tier 2 Engineering Required",
    "Billing & Invoice Inquiry",
    "Hardware RMA Initiated",
    "Follow-up Callback Scheduled",
  ],
  onStateChange,
  onEndCall,
  onTransferCall,
  onSubmitDisposition,
  variant = "docked",
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [agentState, setAgentState] = useState<AgentTelephonyState>(initialState);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isOnHold, setIsOnHold] = useState<boolean>(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [selectedDisposition, setSelectedDisposition] = useState<string>(
    dispositionOptions[0] ?? ""
  );


  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEnd = () => {
    setAgentState("wrap_up");
    onEndCall?.();
  };

  const handleWrapUpSubmit = () => {
    onSubmitDisposition?.(selectedDisposition, notes);
    setAgentState("available");
    setIsScratchpadOpen(false);
    setNotes("");
  };

  return (
    <aside
      className={`${styles.container} ${styles[variant]} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      <div className={styles.barContent}>
        {/* Agent State & Status Indicator */}
        <div className={styles.agentStateGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            📞
          </div>
          <div className={styles.stateSelectWrap}>
            <span id={headingId} className={styles.srOnly}>
              Omnichannel Telephony CTI Dock
            </span>
            <select
              aria-label="Agent Telephony State"
              className={`${styles.stateSelect} ${styles[`state_${agentState}`]}`}
              value={agentState}
              onChange={(e) => {
                const next = e.target.value as AgentTelephonyState;
                setAgentState(next);
                onStateChange?.(next);
              }}
            >
              <option value="available">● Available (Ready)</option>
              <option value="in_call">● In Active Call</option>
              <option value="wrap_up">● Wrap-Up After Call</option>
              <option value="paused">● Paused (Break / Away)</option>
            </select>
          </div>
        </div>

        {/* Active Caller Card */}
        {agentState === "in_call" || agentState === "wrap_up" ? (
          <div className={styles.callerCard}>
            <div className={styles.callerPrimary}>
              <span className={styles.customerName}>{activeCaller.customerName}</span>
              <span className={styles.callerNumber}>{activeCaller.callerNumber}</span>
            </div>
            <div className={styles.callerMeta}>
              <span className={styles.acctBadge}>{activeCaller.accountReference}</span>
              <span className={styles.tierBadge}>{activeCaller.serviceTier}</span>
            </div>
          </div>
        ) : (
          <div className={styles.idleMessage}>
            <span>Awaiting next inbound queue call or customer omnichannel message...</span>
          </div>
        )}

        {/* Call Timer */}
        {agentState === "in_call" && (
          <div className={styles.timerBox}>
            <span className={styles.timerIcon} aria-hidden="true">⏱️</span>
            <span className={styles.timerDigits}>{formatTimer(callDurationSeconds)}</span>
          </div>
        )}

        {/* Telephony Action Buttons */}
        {agentState === "in_call" && (
          <div className={styles.actionButtons}>
            <button
              type="button"
              className={`${styles.controlBtn} ${isMuted ? styles.btnActiveMute : ""}`}
              onClick={() => setIsMuted(!isMuted)}
              aria-pressed={isMuted}
              aria-label={isMuted ? "Unmute Microphone" : "Mute Microphone"}
            >
              {isMuted ? "🔇 Muted" : "🎤 Mute"}
            </button>

            <button
              type="button"
              className={`${styles.controlBtn} ${isOnHold ? styles.btnActiveHold : ""}`}
              onClick={() => setIsOnHold(!isOnHold)}
              aria-pressed={isOnHold}
              aria-label={isOnHold ? "Resume Call from Hold" : "Place Caller on Hold"}
            >
              {isOnHold ? "⏸️ On Hold" : "⏸️ Hold"}
            </button>

            <button
              type="button"
              className={styles.controlBtn}
              onClick={() => onTransferCall?.("Tier-2-Avionics")}
              aria-label="Transfer call to another queue"
            >
              ⇄ Transfer
            </button>

            <button
              type="button"
              className={styles.notesBtn}
              onClick={() => setIsScratchpadOpen(!isScratchpadOpen)}
              aria-expanded={isScratchpadOpen}
            >
              📝 Notes
            </button>

            <button
              type="button"
              className={styles.endCallBtn}
              onClick={handleEnd}
              aria-label="Disconnect and End Call"
            >
              End Call
            </button>
          </div>
        )}

        {/* Wrap-Up Stage Controls */}
        {agentState === "wrap_up" && (
          <div className={styles.wrapUpControls}>
            <select
              aria-label="Call Disposition Classification"
              className={styles.dispositionSelect}
              value={selectedDisposition}
              onChange={(e) => setSelectedDisposition(e.target.value)}
            >
              {dispositionOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <button
              type="button"
              className={styles.completeWrapBtn}
              onClick={handleWrapUpSubmit}
            >
              Complete Wrap-Up
            </button>
          </div>
        )}
      </div>

      {/* Flyout Scratchpad Drawer */}
      {isScratchpadOpen && (
        <div className={styles.scratchpadDrawer}>
          <div className={styles.scratchpadHeader}>
            <h4 className={styles.scratchpadTitle}>
              Call Scratchpad ({activeCaller.accountReference})
            </h4>
            <button
              type="button"
              className={styles.closeDrawerBtn}
              onClick={() => setIsScratchpadOpen(false)}
              aria-label="Close notes drawer"
            >
              ✕
            </button>
          </div>
          <textarea
            className={styles.notesArea}
            rows={3}
            placeholder="Type customer interaction notes, issues, and promised follow-ups..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-label="Customer call notes"
          />
        </div>
      )}
    </aside>
  );
};
