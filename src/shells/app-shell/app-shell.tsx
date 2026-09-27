"use client";

import {
  forwardRef,
  type CSSProperties,
  type ReactNode,
  type FC,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  ChevronDown,
  LayoutGrid,
  LogOut,
  Menu,
  Search,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { Breadcrumb, type BreadcrumbItem } from "../../navigation/breadcrumb";
import { BrandMark } from "../../primitives/brand-mark";
import { ThemeQuickToggle } from "../../foundation/theme/theme-quick-toggle";
import { cva } from "../../foundation/utils/cva";

import styles from "./app-shell.module.css";

/**
 * Closes a dropdown on an outside click (or Escape), rather than on
 * `onMouseLeave`. Click-outside is the pattern every production dropdown
 * uses for robust keyboard and pointer behavior.
 */
function useCloseOnOutsideInteraction(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return ref;
}

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
   */
  variant?: "standard" | "inset" | "floating";

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
  /** The platform's own nav tree — rendered in the sidebar slot. */
  sidebar?: ReactNode;
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
  breadcrumbs,
  sidebar,
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
  const [tenantMenuOpen, setTenantMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainId = useId();
  const sidebarId = useId();

  return (
    <div
      ref={ref}
      data-slot="app-shell"
      data-density={density}
      className={appShellVariants({ variant, density })}
      data-variant={variant}
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

      <header
        data-slot="app-shell-header"
        className={styles.header}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-4)",
          paddingInline: "var(--space-4)",
          borderBlockEnd: "1px solid var(--color-border)",
          background: "var(--color-bg-elevated)",
          flexShrink: 0,
        }}
      >
        {sidebar && (
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-controls={sidebarId}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((v) => !v)}
            style={iconButtonStyle}
            className={`unierp-shell-sidebar-toggle ${styles.sidebarToggle}`}
            title="Toggle navigation"
          >
            <Menu size={18} />
          </button>
        )}

        <BrandMark size="sm" />
        {appSwitcherSlot}
        <div
          style={{ inlineSize: 1, blockSize: 22, background: "var(--color-border)" }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          {platformIcon}
          <span
            style={{
              fontWeight: 600,
              fontSize: "var(--text-sm)",
              color: "var(--shell-accent)",
            }}
          >
            {platformName}
          </span>
        </div>

        {breadcrumbs && breadcrumbs.length > 0 && (
          <>
            <div
              style={{
                inlineSize: 1,
                blockSize: 20,
                background: "var(--color-border)",
              }}
            />
            <Breadcrumb items={breadcrumbs} />
          </>
        )}

        {searchSlot}

        <div className={styles.headerSpacer} style={{ flex: 1 }} />

        {headerActions}

        {(tenant || environmentLabel || realmLabel) && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setTenantMenuOpen((v) => !v)}
              style={pillButtonStyle}
              aria-haspopup="menu"
              aria-expanded={tenantMenuOpen}
              aria-label="Current operating scope"
            >
              {tenant && <span>{tenant.name}</span>}
              {environmentLabel && (
                <>
                  <span aria-hidden="true">/</span>
                  <span>{environmentLabel}</span>
                </>
              )}
              {realmLabel && (
                <>
                  <span aria-hidden="true">/</span>
                  <span>{realmLabel}</span>
                </>
              )}
              {availableTenants && availableTenants.length > 1 && (
                <ChevronDown size={14} />
              )}
            </button>
            {tenant &&
              tenantMenuOpen &&
              availableTenants &&
              availableTenants.length > 1 && (
                <TenantMenu
                  tenants={availableTenants}
                  current={tenant.id}
                  onSelect={(id: string) => {
                    setTenantMenuOpen(false);
                    onTenantChange?.(id);
                  }}
                  onClose={() => setTenantMenuOpen(false)}
                />
              )}
          </div>
        )}

        {platformWizardUrl && (
          <a
            href={platformWizardUrl}
            style={{ ...iconButtonStyle, textDecoration: "none" }}
            aria-label="Switch platform"
            title="Switch platform"
          >
            <LayoutGrid size={18} />
          </a>
        )}

        {showThemeToggle && <ThemeQuickToggle />}

        {userMenuSlot ? (
          userMenuSlot
        ) : user ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              style={{
                ...iconButtonStyle,
                borderRadius: "50%",
                position: "relative",
              }}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              aria-label="Account menu"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  style={{ inlineSize: 28, blockSize: 28, borderRadius: "50%" }}
                />
              ) : (
                <UserIcon size={18} />
              )}
              {presenceColor && (
                <span
                  style={{
                    position: "absolute",
                    insetBlockEnd: 0,
                    insetInlineEnd: 0,
                    inlineSize: 8,
                    blockSize: 8,
                    borderRadius: "50%",
                    backgroundColor: presenceColor,
                    border: "1.5px solid var(--color-bg-elevated)",
                  }}
                  aria-hidden="true"
                />
              )}
            </button>
            {userMenuOpen && (
              <UserMenu
                user={user}
                accountCenterUrl={accountCenterUrl}
                userMenuActions={userMenuActions}
                onSignOut={onSignOut}
                onClose={() => setUserMenuOpen(false)}
              />
            )}
          </div>
        ) : null}
      </header>

      {contextBarSlot}

      <div className={styles.bodyContainer}>
        {sidebar && (
          <div
            id={sidebarId}
            data-slot="app-shell-sidebar"
            className={`unierp-shell-sidebar ${styles.sidebarContainer}`}
            data-open={sidebarOpen}
          >
            {sidebar}
          </div>
        )}
        {sidebar && sidebarOpen && (
          <button type="button" className={styles.sidebarBackdrop} aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />
        )}
        <main
          id={mainId}
          data-slot="app-shell-main"
          tabIndex={-1}
          className={styles.mainArea}
        >
          {children}
        </main>
      </div>
    </div>
  );
});

PlatformShell.displayName = "PlatformShell";

const iconButtonStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  inlineSize: 32,
  blockSize: 32,
  border: "none",
  background: "transparent",
  borderRadius: "var(--radius-md)",
  cursor: "pointer",
  color: "var(--color-text-secondary)",
} as const;

const pillButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "var(--space-1)",
  paddingBlock: "var(--space-1)",
  paddingInline: "var(--space-3)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-full, 999px)",
  background: "var(--color-bg-sunken)",
  fontSize: "var(--text-sm)",
  cursor: "pointer",
  color: "var(--color-text)",
} as const;

const menuPanelStyle = {
  position: "absolute",
  insetBlockStart: "calc(100% + var(--space-1, 4px))",
  insetInlineEnd: 0,
  minInlineSize: 200,
  background: "var(--color-bg-elevated)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  boxShadow: "var(--shadow-lg)",
  paddingBlock: "var(--space-2)",
  paddingInline: "var(--space-2)",
  zIndex: 50,
} as const;

const TenantMenu: FC<{
  tenants: ShellTenant[];
  current: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}> = ({ tenants, current, onSelect, onClose }) => {
  const ref = useCloseOnOutsideInteraction(onClose);
  return (
    <div ref={ref} role="menu" data-slot="app-shell-tenant-menu" style={menuPanelStyle}>
      {tenants.map((t: ShellTenant) => (
        <button
          key={t.id}
          role="menuitem"
          onClick={() => onSelect(t.id)}
          style={{
            display: "block",
            inlineSize: "100%",
            textAlign: "start",
            paddingBlock: "var(--space-2)",
            paddingInline: "var(--space-3)",
            border: "none",
            background:
              t.id === current ? "var(--color-bg-sunken)" : "transparent",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--text-sm)",
            cursor: "pointer",
            fontWeight: t.id === current ? 600 : 400,
          }}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
};

const UserMenu: FC<{
  user: ShellUser;
  accountCenterUrl?: string;
  userMenuActions?: ReactNode;
  onSignOut?: () => void;
  onClose: () => void;
}> = ({ user, accountCenterUrl, userMenuActions, onSignOut, onClose }) => {
  const ref = useCloseOnOutsideInteraction(onClose);
  return (
    <div ref={ref} role="menu" data-slot="app-shell-user-menu" style={menuPanelStyle}>
      <div
        style={{
          paddingBlock: "var(--space-2)",
          paddingInline: "var(--space-3)",
          marginBlockEnd: "var(--space-1)",
        }}
      >
        <div style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
          {user.name}
        </div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
          }}
        >
          {user.email}
        </div>
      </div>
      <div
        style={{
          blockSize: 1,
          background: "var(--color-border)",
          marginBlock: "var(--space-1)",
          marginInline: 0,
        }}
      />
      {accountCenterUrl && (
        <a
          role="menuitem"
          href={accountCenterUrl}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            paddingBlock: "var(--space-2)",
            paddingInline: "var(--space-3)",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--text-sm)",
            color: "var(--color-text)",
            textDecoration: "none",
          }}
        >
          <Settings size={14} /> Account Center
        </a>
      )}
      {userMenuActions}
      {onSignOut && (
        <button
          role="menuitem"
          onClick={onSignOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            inlineSize: "100%",
            textAlign: "start",
            paddingBlock: "var(--space-2)",
            paddingInline: "var(--space-3)",
            border: "none",
            background: "transparent",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--text-sm)",
            cursor: "pointer",
            color: "var(--color-status-danger, var(--color-danger))",
          }}
        >
          <LogOut size={14} /> Sign out
        </button>
      )}
    </div>
  );
};

export { Search };

// Directory-level alias
export const AppShell = PlatformShell;
export type AppShellProps = PlatformShellProps;
