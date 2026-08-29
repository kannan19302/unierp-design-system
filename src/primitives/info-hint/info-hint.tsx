"use client";

import type { CSSProperties, FC, ReactNode } from "react";
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

export const InfoHint: FC<InfoHintProps> = ({
  text,
  size = 14,
  className = "",
  style,
}) => (
  <Tooltip content={text}>
    <span
      role="img"
      aria-label={typeof text === "string" ? text : "More information"}
      tabIndex={0}
      className={`${styles.hintIcon} ${className}`.trim()}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.68),
        ...style,
      }}
    >
      i
    </span>
  </Tooltip>
);
