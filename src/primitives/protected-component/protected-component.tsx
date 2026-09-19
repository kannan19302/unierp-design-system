"use client";

import { type FC, type ReactNode, createContext, useContext, forwardRef } from "react";
import { ShieldAlert, Lock } from "lucide-react";
import { cn } from "../../utils/cn";
import styles from "./protected-component.module.css";

export type FieldAccessLevel = "hidden" | "readonly" | "editable";

export interface ResolvedAccess {
  endpoints: string[];
  pages: string[];
  components: string[];
  fields: Record<string, Record<string, FieldAccessLevel>>;
  recordFilters: Record<string, Record<string, unknown>>;
}

export interface PermissionContextValue {
  permissions: string[];
  resolvedAccess: ResolvedAccess | null;
}

export const PermissionContext = createContext<PermissionContextValue>({
  permissions: [],
  resolvedAccess: null,
});

export const usePermission = (code: string): boolean => {
  const { permissions } = useContext(PermissionContext);
  return permissions.some((p: any) => {
    if (p === code) return true;
    if (p === "*") return true;
    if (p.endsWith(".*") && code.startsWith(p.slice(0, -2))) return true;
    return false;
  });
};

export const useFieldAccess = (
  entity: string,
  field: string,
): FieldAccessLevel => {
  const { resolvedAccess } = useContext(PermissionContext);
  if (!resolvedAccess) return "editable";
  return resolvedAccess.fields?.[entity]?.[field] || "editable";
};

export interface AccessDeniedCardProps {
  permission: string;
  title?: string;
  description?: string;
  onRequestAccess?: () => void;
  className?: string;
}

export const AccessDeniedCard = forwardRef<HTMLDivElement, AccessDeniedCardProps>(
  function AccessDeniedCard(
    {
      permission,
      title = "Access Restricted",
      description = "Your active role lacks the required scope to interact with this protected enterprise module.",
      onRequestAccess,
      className = "",
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(styles.accessDeniedCard, className)}
      >
        <div className={styles.accessDeniedHeader}>
          <div className={styles.lockIconContainer} aria-hidden="true">
            <ShieldAlert size={18} />
          </div>
          <div className={styles.accessDeniedInfo}>
            <div className={styles.accessDeniedTitleRow}>
              <h4 className={styles.accessDeniedTitle}>{title}</h4>
              <span className={styles.scopeBadge}>Scope: {permission}</span>
            </div>
            <p className={styles.accessDeniedDescription}>{description}</p>
            {onRequestAccess && (
              <div className={styles.accessDeniedFooter}>
                <button
                  type="button"
                  onClick={onRequestAccess}
                  style={{
                    fontSize: "var(--text-xs)",
                    padding: "var(--space-1) var(--space-2-5)",
                    borderRadius: "var(--radius-xs)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg-surface)",
                    color: "var(--color-text)",
                    cursor: "pointer",
                    fontWeight: "var(--weight-medium)",
                  }}
                >
                  Request Permission Scope
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

AccessDeniedCard.displayName = "AccessDeniedCard";

export interface ProtectedComponentProps {
  permission: string;
  fallback?: ReactNode;
  showAccessDenied?: boolean;
  onRequestAccess?: () => void;
  children: ReactNode;
}

/**
 * `<ProtectedComponent>` — Role-based access boundary conditionally displaying elements or access-denied cards.
 * @maturity stable
 */
export const ProtectedComponent: FC<ProtectedComponentProps> = ({
  permission,
  fallback = null,
  showAccessDenied = false,
  onRequestAccess,
  children,
}) => {
  const hasAccess = usePermission(permission);
  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback !== null && fallback !== undefined) {
    return <>{fallback}</>;
  }

  if (showAccessDenied) {
    return (
      <AccessDeniedCard
        permission={permission}
        onRequestAccess={onRequestAccess}
      />
    );
  }

  return null;
};

export interface ProtectedFieldProps {
  entity: string;
  field: string;
  showLockIndicator?: boolean;
  children: ReactNode;
}

export const ProtectedField = forwardRef<HTMLDivElement, ProtectedFieldProps>(({
  entity,
  field,
  showLockIndicator = true,
  children,
}, ref) => {
  const access = useFieldAccess(entity, field);
  if (access === "hidden") {
    return (
      <div ref={ref} className={styles.redactedMask} aria-label="Field value hidden by security policy">
        <Lock size={12} aria-hidden="true" />
        <span>REDACTED BY POLICY</span>
      </div>
    );
  }

  if (access === "readonly") {
    return (
      <div ref={ref} className={styles.fieldLockWrapper}>
        {showLockIndicator && (
          <span className={styles.flsBadge}>
            <Lock size={10} aria-hidden="true" />
            <span>FLS: READ-ONLY</span>
          </span>
        )}
        <div className={styles.readonly}>{children}</div>
      </div>
    );
  }

  return <div ref={ref}>{children}</div>;
});

ProtectedField.displayName = "ProtectedField";
