"use client";

import { type FC, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import styles from "./alert.module.css";

export type InlineMessageVariant = "info" | "success" | "warning" | "danger";

const Icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  danger: XCircle,
};

export interface InlineMessageProps {
  variant?: InlineMessageVariant;
  children: ReactNode;
  className?: string;
}

export const InlineMessage: FC<InlineMessageProps> = ({
  variant = "info",
  children,
  className = "",
}) => {
  const IconComponent = Icons[variant];
  return (
    <span className={`${styles.inlineMessage} ${className}`.trim()}>
      <IconComponent size={14} className={styles.icon} />
      <span>{children}</span>
    </span>
  );
};
