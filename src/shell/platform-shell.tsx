"use client";

import { type CSSProperties, type FC, type ReactNode, useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutGrid, LogOut, Menu, Search, User as UserIcon } from "lucide-react";
import { Breadcrumb, type BreadcrumbItem } from "../components/extended-navigation";

/**
 * The navigation contract every UniERP platform shares.
 *
 * Before this, there was no common header, platform switcher, or tenant
 * switcher anywhere in the ten apps — each would otherwise reinvent its own,
 * and the "one product, ten platforms" experience the wizard exists to
 * deliver would never actually hold at the chrome level. `<PlatformShell>` is
 * the one navigational frame; what varies between platforms is the accent
 * colour and the nav tree it's handed, both of which come from that
 * platform's own `platform.manifest.ts` (see manifest.ts in this directory).
 */


/**
 * Closes a dropdown on an outside click (or Escape), rather than on
 * `onMouseLeave`. Mouse-leave closing is fragile for real pointer movement —
 * a path from the trigger to a menu item that clips the gap between them, or
 * simply moves fast, exits the hover area and closes the menu before the
 * click ever lands. Click-outside is the pattern every production dropdown
 * uses for exactly this reason, and it is also what makes the menu usable by
 * keyboard (Escape) rather than only by a mouse that never leaves the area.
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
   * Wizard (:4000), never a second in-app platform picker. Omit only for the
   * wizard itself, which has nothing to switch back to. */
  platformWizardUrl?: string;

  breadcrumbs?: BreadcrumbItem[];
  /** The platform's own nav tree — rendered in the sidebar slot. */
  sidebar?: ReactNode;
  /** e.g. a notification bell, a command-palette trigger. */
  headerActions?: ReactNode;

  onSignOut?: () => void;

  children: ReactNode;
}

/**
 * The shared chrome: header (platform identity, tenant switcher, user menu,
 * sign-out) plus a sidebar slot and a content region. Every platform's
 * `app/(dashboard)/layout.tsx` wraps its page tree in this, handing it that
 * platform's own manifest-derived nav — the shell does not know what ERP or
 * Web Studio or the Marketplace look like, only how to frame them the same way.
 */
export const PlatformShell: FC<PlatformShellProps> = ({
  platformName,
  platformIcon,
  accentColor = "var(--color-primary)",
  user,
  tenant,
  availableTenants,
  onTenantChange,
  platformWizardUrl,
  breadcrumbs,
  sidebar,
  headerActions,
  onSignOut,
  children,
}) => {
  const [tenantMenuOpen, setTenantMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      style={
        {
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          // Exposed so a platform's own stylesheet can key off its accent
          // without this component needing to know what the accent is used
          // for. React's CSSProperties type doesn't model custom properties,
          // hence the cast — the value itself is still a plain string.
          "--shell-accent": accentColor,
        } as CSSProperties
      }
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-4)",
          height: "56px",
          padding: "0 var(--space-4)",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-elevated)",
          flexShrink: 0,
        }}
      >
        {sidebar && (
          <button
            aria-label="Toggle navigation"
            onClick={() => setSidebarOpen((v) => !v)}
            style={iconButtonStyle}
            // Sidebar collapses below the point a fixed 240px rail stops
            // leaving room for content — the same breakpoint list-page-template
            // and the rest of this package already design around.
            className="unierp-shell-sidebar-toggle"
          >
            <Menu size={18} />
          </button>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          {platformIcon}
          <span style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--shell-accent)" }}>
            {platformName}
          </span>
        </div>

        {breadcrumbs && breadcrumbs.length > 0 && (
          <>
            <div style={{ width: 1, height: 20, background: "var(--color-border)" }} />
            <Breadcrumb items={breadcrumbs} />
          </>
        )}

        <div style={{ flex: 1 }} />

        {headerActions}

        {tenant && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setTenantMenuOpen((v) => !v)}
              style={pillButtonStyle}
              aria-haspopup="menu"
              aria-expanded={tenantMenuOpen}
            >
              <span>{tenant.name}</span>
              {availableTenants && availableTenants.length > 1 && <ChevronDown size={14} />}
            </button>
            {tenantMenuOpen && availableTenants && availableTenants.length > 1 && (
              <TenantMenu
                tenants={availableTenants}
                current={tenant.id}
                onSelect={(id) => {
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

        {user && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              style={{ ...iconButtonStyle, borderRadius: "50%" }}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              aria-label="Account menu"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  style={{ width: 28, height: 28, borderRadius: "50%" }}
                />
              ) : (
                <UserIcon size={18} />
              )}
            </button>
            {userMenuOpen && (
              <UserMenu user={user} onSignOut={onSignOut} onClose={() => setUserMenuOpen(false)} />
            )}
          </div>
        )}
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {sidebar && (
          <div
            className="unierp-shell-sidebar"
            data-open={sidebarOpen}
            style={{ height: "100%", flexShrink: 0 }}
          >
            {sidebar}
          </div>
        )}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            overflow: "auto",
            background: "var(--color-bg)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

const iconButtonStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
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
  padding: "var(--space-1) var(--space-3)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-full, 999px)",
  background: "var(--color-bg-sunken)",
  fontSize: "var(--text-sm)",
  cursor: "pointer",
  color: "var(--color-text)",
} as const;

const menuPanelStyle = {
  position: "absolute",
  top: "calc(100% + 4px)",
  right: 0,
  minWidth: 200,
  background: "var(--color-bg-elevated)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  boxShadow: "var(--shadow-lg, 0 8px 24px rgba(0,0,0,0.16))",
  padding: "var(--space-2)",
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
  <div ref={ref} role="menu" style={menuPanelStyle}>
    {tenants.map((t) => (
      <button
        key={t.id}
        role="menuitem"
        onClick={() => onSelect(t.id)}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          padding: "var(--space-2) var(--space-3)",
          border: "none",
          background: t.id === current ? "var(--color-bg-sunken)" : "transparent",
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

const UserMenu: FC<{ user: ShellUser; onSignOut?: () => void; onClose: () => void }> = ({
  user,
  onSignOut,
  onClose,
}) => {
  const ref = useCloseOnOutsideInteraction(onClose);
  return (
  <div ref={ref} role="menu" style={menuPanelStyle}>
    <div style={{ padding: "var(--space-2) var(--space-3)", marginBottom: "var(--space-1)" }}>
      <div style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>{user.name}</div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
        {user.email}
      </div>
    </div>
    <div style={{ height: 1, background: "var(--color-border)", margin: "var(--space-1) 0" }} />
    {onSignOut && (
      <button
        role="menuitem"
        onClick={onSignOut}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          width: "100%",
          textAlign: "left",
          padding: "var(--space-2) var(--space-3)",
          border: "none",
          background: "transparent",
          borderRadius: "var(--radius-sm)",
          fontSize: "var(--text-sm)",
          cursor: "pointer",
          color: "var(--color-danger)",
        }}
      >
        <LogOut size={14} /> Sign out
      </button>
    )}
  </div>
  );
};

// Re-exported so a consumer can build a header search affordance that matches
// the shell's own icon sizing without importing lucide-react directly.
export { Search };
