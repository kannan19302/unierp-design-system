import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { Info } from "lucide-react";
import { Tooltip } from "../../overlays/tooltip";
import styles from "./info-hint.module.css";

export interface InfoHintProps {
  /** Short plain-language explanation of what the adjacent control does. */
  text: ReactNode;
  /** Icon diameter in px (default 14). */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * `<InfoHint>` — Accessible inline explanatory hint triggering a contextual tooltip.
 * @maturity stable
 */
export const InfoHint = forwardRef<HTMLSpanElement, InfoHintProps>(({
  text,
  size = 14,
  className = "",
  style,
}, ref) => (
  <Tooltip content={text}>
    <span
      ref={ref}
      role="img"
      aria-label={typeof text === "string" ? text : "More information"}
      tabIndex={0}
      className={`${styles.hintIcon} ${className}`.trim()}
      style={{
        width: size,
        height: size,
        ...style,
      }}
    >
      <Info size={size} aria-hidden="true" className={styles.svgIcon} />
    </span>
  </Tooltip>
));

InfoHint.displayName = "InfoHint";
