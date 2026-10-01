"use client";

import {
  cloneElement,
  forwardRef,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Search } from "lucide-react";
import type { BreadcrumbItem } from "../../navigation/breadcrumb";
import { cva } from "../../foundation/utils/cva";
import { TopNav, type TopNavProps, type TopNavItem } from "../../navigation/top-nav";

import styles from "./app-shell.module.css";

export interface ShellUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface ShellTenant {
  id: string;
  name: string;
}

export interface ShellPlatformSummary {
  code: string;
  name: string;
  href: string;
  icon?: ReactNode;
}

export interface PlatformShellProps {
  /** Visual presentation variant:
   * - "standard": edge-to-edge sidebar and main workspace (benchmark: ShadcnBlocks Shell 1)
   * - "inset": sunken outer container with elevated, rounded workspace card (benchmark: ShadcnBlocks Shell 2)
   * - "floating": detached floating sidebar and workspace panels with rounded radii (benchmark: ShadcnBlocks Shell 5)
   * - "topbar": horizontal navigation beneath the global header
   * - "dual": sidebar, workspace, and a secondary details panel
   */
  variant?: "standard" | "inset" | "floating" | "topbar" | "dual";
  /** Place the sidebar beside the full-height workspace, with the header above main content. Falls back to global when a banner or context bar occupies the frame. */
  headerPlacement?: "global" | "workspace";

  /** This platform's identity — drives the accent and the header label. */
  platformName: string;
  platformIcon?: ReactNode;
  /** CSS custom property value, e.g. "var(--color-accent-erp)" — see tokens. */
  accentColor?: string;

  user: ShellUser | null;
  tenant?: ShellTenant | null;
  /** Other tenants this user may switch into, if the platform supports it. */
  availableTenants?: ShellTenant[];
  onTenantChange?: (tenantId: string) => void;

  /** Renders "Switch platform" — always routes back to the Global Platform
   * Wizard (:4000), never a second in-app platform picker. */
  platformWizardUrl?: string;
  /** Unified profile, security, sessions, accessibility and preferences hub. */
  accountCenterUrl?: string;
  /** Signature scope strip: makes the current operating context unmistakable. */
  environmentLabel?: string;
  realmLabel?: string;
  /** Light/dark stays in global navigation; advanced themes live in Account Center. */
  showThemeToggle?: boolean;

  breadcrumbs?: BreadcrumbItem[];
  /** Page or workspace title displayed in the top bar */
  title?: ReactNode;
  /** Controlled sidebar collapse state for desktop icon rail */
  sidebarCollapsed?: boolean;
  defaultSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: (collapsed: boolean) => void;
  /** The platform's own nav tree — rendered in the sidebar slot. */
  sidebar?: ReactNode;
  /** Canonical TopNav slot overriding default top bar rendering. */
  topNav?: ReactNode;
  /** Direct TopNavItem list rendered inside the top bar. */
  topNavItems?: TopNavItem[];
  /** Callback when a top navigation item is selected. */
  onTopNavItemSelect?: (item: TopNavItem) => void;
  /** Horizontal application navigation, usually paired with the topbar variant. */
  topNavigation?: ReactNode;
  /** Secondary context/details panel, usually paired with the dual variant. */
  inspector?: ReactNode;
  inspectorLabel?: string;
  /** e.g. a notification bell, a command-palette trigger. */
  headerActions?: ReactNode;

  /** Global search or command palette trigger / input slot. */
  searchSlot?: ReactNode;
  /** App or module switcher button slot, rendered next to platform name. */
  appSwitcherSlot?: ReactNode;
  /** Optional custom user menu / hover card slot overriding default menu. */
  userMenuSlot?: ReactNode;
  /** Avatar presence dot color (e.g. "var(--color-success)"). */
  presenceColor?: string;
  /** Top-level banner slot (e.g. impersonation warning, trial countdown). */
  bannerSlot?: ReactNode;
  /** Context bar slot between header and main workspace (e.g. StrataBar). */
  contextBarSlot?: ReactNode;
  /** Additional items rendered inside the user menu panel. */
  userMenuActions?: ReactNode;

  onSignOut?: () => void;

  /** 4-tier density scaling */
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";

  children: ReactNode;
}

export const appShellVariants = cva(styles.shellRoot, {
  variants: {
    variant: {
      standard: "",
      inset: styles.variantInset,
      floating: styles.variantFloating,
      topbar: styles.variantTopbar,
      dual: styles.variantDual,
    },
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    variant: "standard",
    density: "standard",
  },
});

/**
 * `<PlatformShell>` — The shared navigation and workspace frame across all UniERP platforms.
 * @maturity stable
 */
export const PlatformShell = forwardRef<HTMLDivElement, PlatformShellProps>(({
  variant = "standard",
  headerPlacement = "global",
  density = "standard",
  platformName,
  platformIcon,
  accentColor = "var(--color-primary)",
  user,
  tenant,
  availableTenants,
  onTenantChange,
  platformWizardUrl,
  accountCenterUrl,
  environmentLabel,
  realmLabel,
  showThemeToggle = true,
  title,
  sidebarCollapsed,
  defaultSidebarCollapsed,
  onToggleSidebarCollapse,
  breadcrumbs,
  sidebar,
  topNav,
  topNavItems,
  onTopNavItemSelect,
  topNavigation,
  inspector,
  inspectorLabel = "Details panel",
  headerActions,
  searchSlot,
  appSwitcherSlot,
  userMenuSlot,
  presenceColor,
  bannerSlot,
  contextBarSlot,
  userMenuActions,
  onSignOut,
  children,
}, ref) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [internalSidebarCollapsed, setInternalSidebarCollapsed] = useState(defaultSidebarCollapsed ?? false);
  const isSidebarCollapsed = sidebarCollapsed ?? internalSidebarCollapsed;
  const sidebarToggleRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainId = useId();
  const sidebarId = useId();
  const effectiveHeaderPlacement = headerPlacement === "workspace" && sidebar && !bannerSlot && !contextBarSlot
    ? "workspace"
    : "global";

  const handleToggleSidebar = () => {
    setSidebarOpen((v) => !v);
    const next = !isSidebarCollapsed;
    if (sidebarCollapsed === undefined) {
      setInternalSidebarCollapsed(next);
    }
    onToggleSidebarCollapse?.(next);
  };

  const effectiveSidebar = isValidElement(sidebar) && typeof sidebar.type !== "string"
    ? cloneElement(sidebar as ReactElement<Record<string, unknown>>, {
        collapsed: (sidebar.props as Record<string, unknown>).collapsed ?? isSidebarCollapsed,
        onToggleCollapse: (next?: boolean) => {
          const nextVal = next ?? !isSidebarCollapsed;
          if (sidebarCollapsed === undefined) {
            setInternalSidebarCollapsed(nextVal);
          }
          onToggleSidebarCollapse?.(nextVal);
          ((sidebar.props as Record<string, unknown>).onToggleCollapse as ((v: boolean) => void) | undefined)?.(nextVal);
        },
      })
    : sidebar;

  useEffect(() => {
    if (!sidebarOpen) return;
    if (window.matchMedia?.("(max-width: 47.9375rem)").matches ?? true) {
      sidebarRef.current?.querySelector<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])")?.focus();
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (!(window.matchMedia?.("(max-width: 47.9375rem)").matches ?? true)) return;
      if (event.key === "Escape") {
        setSidebarOpen(false);
        sidebarToggleRef.current?.focus();
      } else if (event.key === "Tab") {
        const focusable = sidebarRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])");
        if (!focusable?.length) return;
        const first = focusable.item(0);
        const last = focusable.item(focusable.length - 1);
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [sidebarOpen]);

  return (
    <div
      ref={ref}
      data-slot="app-shell"
      data-density={density}
      className={appShellVariants({ variant, density })}
      data-variant={variant}
      data-header-placement={effectiveHeaderPlacement}
      data-sidebar-collapsed={isSidebarCollapsed ? "true" : "false"}
      data-has-inspector={inspector ? "true" : "false"}
      style={
        {
          "--shell-accent": accentColor,
        } as CSSProperties
      }
    >
      <a href={`#${mainId}`} data-slot="app-shell-skip-link" className={styles.skipLink}>
        Skip to main content
      </a>

      {bannerSlot}

      {topNav !== undefined ? (
        isValidElement(topNav) ? (
          cloneElement(topNav as ReactElement<Record<string, unknown>>, {
            sidebarOpen: (topNav.props as Record<string, unknown>).sidebarOpen ?? sidebarOpen,
            onToggleSidebar: (topNav.props as Record<string, unknown>).onToggleSidebar ?? (sidebar ? handleToggleSidebar : undefined),
            sidebarControlsId: (topNav.props as Record<string, unknown>).sidebarControlsId ?? sidebarId,
            showSidebarToggle: (topNav.props as Record<string, unknown>).showSidebarToggle ?? Boolean(sidebar),
            sidebarToggleRef: (topNav.props as Record<string, unknown>).sidebarToggleRef ?? sidebarToggleRef,
            title: (topNav.props as Record<string, unknown>).title ?? title,
            breadcrumbs: (topNav.props as Record<string, unknown>).breadcrumbs ?? breadcrumbs,
            density: (topNav.props as Record<string, unknown>).density ?? density,
            className: (topNav.props as Record<string, unknown>).className
              ? `${styles.header} ${(topNav.props as Record<string, unknown>).className}`
              : styles.header,
          })
        ) : (
          topNav
        )
      ) : (
        <TopNav
          data-slot="app-shell-header"
          className={styles.header}
          density={density}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={sidebar ? handleToggleSidebar : undefined}
          sidebarControlsId={sidebarId}
          showSidebarToggle={Boolean(sidebar)}
          sidebarToggleRef={sidebarToggleRef}
          title={title}
          platformName={platformName}
          platformIcon={platformIcon}
          platformWizardUrl={platformWizardUrl}
          appSwitcherSlot={appSwitcherSlot}
          breadcrumbs={breadcrumbs}
          searchSlot={searchSlot}
          actions={headerActions}
          tenant={tenant}
          availableTenants={availableTenants}
          onTenantChange={onTenantChange}
          environmentLabel={environmentLabel}
          realmLabel={realmLabel}
          showThemeToggle={showThemeToggle}
          user={user}
          accountCenterUrl={accountCenterUrl}
          userMenuSlot={userMenuSlot}
          userMenuActions={userMenuActions}
          presenceColor={presenceColor}
          onSignOut={onSignOut}
          items={topNavItems}
          onItemSelect={onTopNavItemSelect}
        />
      )}


      {topNavigation && (
        <div data-slot="app-shell-top-navigation" className={styles.topNavigation}>
          {topNavigation}
        </div>
      )}

      {contextBarSlot}

      <div className={styles.bodyContainer}>
        {sidebar && (
          <div
            ref={sidebarRef}
            id={sidebarId}
            data-slot="app-shell-sidebar"
            className={`unierp-shell-sidebar ${styles.sidebarContainer}`}
            data-open={sidebarOpen}
            data-collapsed={isSidebarCollapsed ? "true" : "false"}
          >
            {effectiveSidebar}
          </div>
        )}
        {sidebar && sidebarOpen && (
          <button type="button" className={styles.sidebarBackdrop} aria-label="Close navigation" onClick={() => { setSidebarOpen(false); sidebarToggleRef.current?.focus(); }} />
        )}
        <main
          id={mainId}
          data-slot="app-shell-main"
          tabIndex={0}
          className={styles.mainArea}
        >
          {children}
        </main>
        {inspector && (
          <aside data-slot="app-shell-inspector" className={styles.inspector} aria-label={inspectorLabel}>
            {inspector}
          </aside>
        )}
      </div>
    </div>
  );
});

PlatformShell.displayName = "PlatformShell";

export { Search };

// Re-export TopNav primitives for shell consumers
export { TopNav, type TopNavProps, type TopNavItem };

// Directory-level alias
export const AppShell = PlatformShell;
export type AppShellProps = PlatformShellProps;
