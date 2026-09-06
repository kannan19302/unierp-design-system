import React, { useState } from "react";
import styles from "./hierarchical-path-dropdown-trail.module.css";

export interface PathSegmentSibling {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isCurrent?: boolean;
}

export interface PathSegment {
  id: string;
  label: string;
  icon?: React.ReactNode;
  siblings?: PathSegmentSibling[];
  onSelectSibling?: (siblingId: string) => void;
}

export interface HierarchicalPathDropdownTrailProps {
  segments: PathSegment[];
  onSegmentClick?: (segment: PathSegment) => void;
  showCopyPath?: boolean;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

export const HierarchicalPathDropdownTrail: React.FC<HierarchicalPathDropdownTrailProps> = ({
  segments,
  onSegmentClick,
  showCopyPath = true,
  density = "standard",
  className = "",
  testId = "hierarchical-path-dropdown-trail",
}) => {
  const [openSegmentId, setOpenSegmentId] = useState<string | null>(null);
  const [siblingSearch, setSiblingSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSegmentTrigger = (segment: PathSegment) => {
    if (segment.siblings && segment.siblings.length > 0) {
      if (openSegmentId === segment.id) {
        setOpenSegmentId(null);
      } else {
        setOpenSegmentId(segment.id);
        setSiblingSearch("");
      }
    } else {
      onSegmentClick?.(segment);
    }
  };

  const handleCopy = () => {
    const fullPath = segments.map((s) => s.label).join(" / ");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullPath).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <nav
      className={`${styles.trailNav ?? ""} ${className}`}
      data-density={density}
      data-testid={testId}
      aria-label="Hierarchical Resource Trail"
    >
      <ol className={styles.trailList ?? ""} role="list">
        {segments.map((segment, idx) => {
          const isLast = idx === segments.length - 1;
          const isOpen = openSegmentId === segment.id;
          const hasSiblings = segment.siblings && segment.siblings.length > 0;

          const filteredSiblings = segment.siblings?.filter((s) =>
            s.label.toLowerCase().includes(siblingSearch.toLowerCase())
          );

          return (
            <li key={segment.id} className={styles.segmentItem ?? ""}>
              <button
                type="button"
                className={`${styles.segmentBtn ?? ""} ${isLast ? (styles.segmentCurrent ?? "") : ""}`}
                onClick={() => handleSegmentTrigger(segment)}
                aria-current={isLast ? "location" : undefined}
                aria-expanded={hasSiblings ? isOpen : undefined}
                aria-haspopup={hasSiblings ? "true" : undefined}
                aria-label={`${segment.label}${hasSiblings ? " (has siblings)" : ""}`}
              >
                {segment.icon && <span aria-hidden="true">{segment.icon}</span>}
                <span>{segment.label}</span>
                {hasSiblings && <span aria-hidden="true">▾</span>}
              </button>

              {isOpen && hasSiblings && (
                <div
                  className={styles.dropdownMenu ?? ""}
                  role="region"
                  aria-label={`${segment.label} siblings`}
                >
                  <input
                    type="text"
                    className={styles.searchInput ?? ""}
                    placeholder="Filter sibling resources..."
                    value={siblingSearch}
                    onChange={(e) => setSiblingSearch(e.target.value)}
                    aria-label="Filter sibling resources"
                    autoFocus
                  />
                  <ul className={styles.siblingList ?? ""} role="list">
                    {filteredSiblings?.map((sib) => (
                      <li key={sib.id}>
                        <button
                          type="button"
                          className={`${styles.siblingBtn ?? ""} ${sib.isCurrent ? (styles.siblingCurrent ?? "") : ""}`}
                          onClick={() => {
                            segment.onSelectSibling?.(sib.id);
                            setOpenSegmentId(null);
                          }}
                          aria-label={sib.label}
                        >
                          <span>{sib.label}</span>
                          {sib.isCurrent && <span aria-hidden="true">✓</span>}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!isLast && (
                <span className={styles.chevron ?? ""} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {showCopyPath && (
        <div className={styles.actionsSection ?? ""}>
          <button
            type="button"
            className={styles.copyBtn ?? ""}
            onClick={handleCopy}
            aria-label="Copy path to clipboard"
          >
            {copied ? "Copied!" : "Copy Path"}
          </button>
        </div>
      )}
    </nav>
  );
};
