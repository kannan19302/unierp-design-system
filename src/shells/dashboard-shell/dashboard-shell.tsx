"use client";

import { useState, type ReactNode } from "react";
import { SideNav, type SideNavProps } from "../../navigation/sidebar";
import { PlatformShell, type PlatformShellProps } from "../app-shell";
import styles from "./dashboard-shell.module.css";

export type DashboardShellVariant = "standard" | "inset" | "floating" | "analytics" | "operations";

export interface DashboardShellProps extends Omit<PlatformShellProps, "children" | "sidebar" | "variant"> {
  /** Visual layout only; applications own all data and authorization. */
  variant?: DashboardShellVariant;
  /** Existing SideNav props, including the consumer's navigation tree. */
  navigation?: SideNavProps;
  /** Consumer supplied sidebar, for a shared SideNav composition. Takes precedence over navigation. */
  sidebar?: ReactNode;
  /** Page heading, description, filters, or other introductory content. */
  intro?: ReactNode;
  /** Summary cards, typically three or four. */
  metrics?: ReactNode;
  /** Main dashboard panels. */
  primary?: ReactNode;
  /** Supporting dashboard panels. */
  secondary?: ReactNode;
  /** Record table or other full-width content. */
  records?: ReactNode;
  footer?: ReactNode;
}

/**
 * DashboardShell composes the shared application frame and SideNav with
 * responsive, consumer-supplied dashboard regions.
 * @maturity experimental
 */
export function DashboardShell({
  variant = "standard",
  navigation,
  sidebar,
  intro,
  metrics,
  primary,
  secondary,
  records,
  footer,
  density = "standard",
  ...shellProps
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { collapsed: controlledCollapsed, onToggleCollapse, density: navigationDensity, ...navigationProps } = navigation ?? {};
  const isCollapsed = controlledCollapsed ?? collapsed;
  const shellVariant = variant === "inset" || variant === "floating" ? variant : "standard";

  return (
    <PlatformShell
      {...shellProps}
      density={density}
      variant={shellVariant}
      sidebar={sidebar ?? (navigation ?
        <SideNav
          {...navigationProps}
          density={navigationDensity ?? density}
          collapsed={isCollapsed}
          onToggleCollapse={(next) => {
            const nextValue = next ?? !isCollapsed;
            if (controlledCollapsed === undefined) setCollapsed(nextValue);
            onToggleCollapse?.(nextValue);
          }}
        />
      : undefined)}
    >
      <div data-slot="dashboard-shell" data-variant={variant} data-density={density} className={styles.dashboard}>
        {intro && <div data-slot="dashboard-shell-intro" className={styles.intro}>{intro}</div>}
        {metrics && <div data-slot="dashboard-shell-metrics" className={styles.metrics}>{metrics}</div>}
        {(primary || secondary) && (
          <div data-slot="dashboard-shell-panels" className={styles.panels}>
            {primary && <div data-slot="dashboard-shell-primary" className={styles.primary}>{primary}</div>}
            {secondary && <div data-slot="dashboard-shell-secondary" className={styles.secondary}>{secondary}</div>}
          </div>
        )}
        {records && <div data-slot="dashboard-shell-records" className={styles.records}>{records}</div>}
        {footer && <div data-slot="dashboard-shell-footer" className={styles.footer}>{footer}</div>}
      </div>
    </PlatformShell>
  );
}
