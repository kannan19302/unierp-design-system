"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
} from "lucide-react";
import type { BreadcrumbItem } from "../breadcrumb";
import { ThemeQuickToggle } from "../../foundation/theme/theme-quick-toggle";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./top-nav.module.css";

export type TopNavDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface TopNavUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface TopNavTenant {
  id: string;
  name: string;
}

export interface TopNavItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

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

const TenantMenu: FC<{
  tenants: TopNavTenant[];
  current: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}> = ({ tenants, current, onSelect, onClose }) => {
  const ref = useCloseOnOutsideInteraction(onClose);
  return (
    <div ref={ref} role="menu" data-slot="top-nav-tenant-menu" className={styles.menuPanel}>
      {tenants.map((t) => (
        <button
          key={t.id}
          type="button"
          role="menuitem"
          onClick={() => onSelect(t.id)}
          className={`${styles.menuItem} ${t.id === current ? styles.menuItemActive : ""}`}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
};

const UserMenu: FC<{
  user: TopNavUser;
  accountCenterUrl?: string;
  userMenuActions?: ReactNode;
  onSignOut?: () => void;
  onClose: () => void;
}> = ({ user, accountCenterUrl, userMenuActions, onSignOut, onClose }) => {
  const ref = useCloseOnOutsideInteraction(onClose);
  return (
    <div ref={ref} role="menu" data-slot="top-nav-user-menu" className={styles.menuPanel}>
      <div className={styles.userInfo}>
        <div className={styles.userName}>{user.name}</div>
        <div className={styles.userEmail}>{user.email}</div>
      </div>
      <div className={styles.menuDivider} />
      {accountCenterUrl && (
        <a
          role="menuitem"
          href={accountCenterUrl}
          className={styles.menuItem}
          onClick={onClose}
        >
          <Settings size={14} aria-hidden="true" />
          <span>Account Center</span>
        </a>
      )}
      {userMenuActions}
      {onSignOut && (
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            onClose();
            onSignOut();
          }}
          className={`${styles.menuItem} ${styles.menuItemDanger}`}
        >
          <LogOut size={14} aria-hidden="true" />
          <span>Sign out</span>
        </button>
      )}
    </div>
  );
};

export const topNavVariants = cva(styles.topNav, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export interface TopNavProps
  extends Omit<HTMLAttributes<HTMLElement>, "title">,
    VariantProps<typeof topNavVariants> {
  /** 4-tier density scaling */
  density?: TopNavDensity;

  /** Sidebar toggle integration */
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  sidebarControlsId?: string;
  showSidebarToggle?: boolean;
  sidebarToggleRef?: React.Ref<HTMLButtonElement>;

  /** Page title and breadcrumbs matching benchmark design */
  title?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  pageContext?: ReactNode;

  /** Horizontal navigation items (optional) */
  items?: TopNavItem[];
  activeItemId?: string;
  onItemSelect?: (item: TopNavItem) => void;

  /** Search and custom actions */
  searchSlot?: ReactNode;
  onSearchClick?: () => void;
  actions?: ReactNode;
  hasNotifications?: boolean;
  onNotificationClick?: () => void;

  /** Theme control */
  showThemeToggle?: boolean;

  /** Operating scope & tenant (optional) */
  tenant?: TopNavTenant | null;
  availableTenants?: TopNavTenant[];
  onTenantChange?: (tenantId: string) => void;
  environmentLabel?: string;
  realmLabel?: string;
  showTenantScope?: boolean;

  /** Platform and brand identity (optional) */
  brandMark?: ReactNode;
  platformName?: string;
  platformIcon?: ReactNode;
  platformWizardUrl?: string;
  appSwitcherSlot?: ReactNode;

  /** User and account access */
  user?: TopNavUser | null;
  userInitials?: string;
  accountCenterUrl?: string;
  userMenuSlot?: ReactNode;
  userMenuActions?: ReactNode;
  presenceColor?: string;
  onSignOut?: () => void;
}

const defaultBreadcrumbs: BreadcrumbItem[] = [
  { key: "home", label: "Home", href: "#home" },
  { key: "analytics", label: "Analytics", href: "#analytics" },
  { key: "overview", label: "Overview" },
];

/**
 * `<TopNav>` — The authoritative Strata DL top navigation bar.
 * Matches the benchmark design:
 * Left: sidebar toggle hamburger + vertically stacked Page Title and Breadcrumbs (`Home > Analytics > Overview`).
 * Right: Search icon button, Dark/Light mode switch icon, Notification bell with red badge, and User avatar circle (initials / menu).
 *
 * @maturity stable
 */
export const TopNav = forwardRef<HTMLElement, TopNavProps>(({
  density = "standard",
  sidebarOpen = false,
  onToggleSidebar,
  sidebarControlsId,
  showSidebarToggle = true,
  sidebarToggleRef,
  title,
  breadcrumbs,
  pageContext,
  items,
  activeItemId,
  onItemSelect,
  searchSlot,
  onSearchClick,
  actions,
  hasNotifications = true,
  onNotificationClick,
  showThemeToggle = true,
  tenant,
  availableTenants,
  onTenantChange,
  environmentLabel,
  realmLabel,
  showTenantScope,
  brandMark,
  platformName,
  platformIcon,
  platformWizardUrl,
  appSwitcherSlot,
  user,
  userInitials,
  accountCenterUrl,
  userMenuSlot,
  userMenuActions,
  presenceColor,
  onSignOut,
  className = "",
  children,
  ...props
}, ref) => {
  const [tenantMenuOpen, setTenantMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleTenantMenu = useCallback(() => {
    setTenantMenuOpen((prev) => !prev);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setUserMenuOpen((prev) => !prev);
  }, []);

  const effectiveTitle = title ?? (platformName || "Dashboard");
  const effectiveBreadcrumbs = breadcrumbs ?? (title ? undefined : defaultBreadcrumbs);

  // Compute initials for the circular avatar (benchmark: "JD")
  const computedInitials = userInitials ?? (
    user?.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "JD"
  );

  const effectiveShowTenantScope = showTenantScope !== undefined
    ? showTenantScope
    : Boolean(tenant || environmentLabel || realmLabel);

  return (
    <header
      ref={ref}
      role="banner"
      data-slot="top-nav"
      data-density={density}
      className={`${topNavVariants({ density })} ${className}`.trim()}
      {...props}
    >
      <div data-slot="top-nav-start" className={styles.startCluster}>
        {showSidebarToggle && onToggleSidebar && (
          <button
            ref={sidebarToggleRef}
            type="button"
            data-slot="top-nav-sidebar-toggle"
            aria-label="Toggle navigation"
            aria-controls={sidebarControlsId}
            aria-expanded={sidebarOpen}
            onClick={onToggleSidebar}
            className={`unierp-shell-sidebar-toggle ${styles.sidebarToggle}`}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose size={18} aria-hidden="true" />
            ) : (
              <PanelLeftOpen size={18} aria-hidden="true" />
            )}
          </button>
        )}

        {/* Vertically stacked Title & Breadcrumbs matching benchmark */}
        <div data-slot="top-nav-title-stack" className={styles.titleStack}>
          <div data-slot="top-nav-title" className={styles.pageTitle}>
            {effectiveTitle}
          </div>
          {effectiveBreadcrumbs && effectiveBreadcrumbs.length > 0 && (
            <nav data-slot="top-nav-breadcrumbs" aria-label="Breadcrumb" className={styles.breadcrumbs}>
              <ol className={styles.breadcrumbList}>
                {effectiveBreadcrumbs.map((crumb, idx) => {
                  const isLast = idx === effectiveBreadcrumbs.length - 1;
                  return (
                    <li key={crumb.key ?? idx} className={styles.breadcrumbItem}>
                      {idx > 0 && (
                        <ChevronRight size={12} className={styles.breadcrumbSeparator} aria-hidden="true" />
                      )}
                      {crumb.href && !isLast ? (
                        <a href={crumb.href} onClick={crumb.onClick} className={styles.breadcrumbLink}>
                          {crumb.label}
                        </a>
                      ) : (
                        <span
                          className={isLast ? styles.breadcrumbCurrent : styles.breadcrumbText}
                          aria-current={isLast ? "page" : undefined}
                        >
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}
        </div>
      </div>

      <div data-slot="top-nav-center" className={styles.centerCluster}>
        {pageContext}

        {items && items.length > 0 && (
          <nav
            data-slot="top-nav-items"
            aria-label="Module navigation"
            className={styles.navItems}
          >
            {items.map((item) => {
              const isActive = item.active ?? (activeItemId === item.id);
              const handleClick = () => {
                item.onClick?.();
                onItemSelect?.(item);
              };
              if (item.href) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={handleClick}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                );
              }
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  disabled={item.disabled}
                  onClick={handleClick}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {children}
      </div>

      <div data-slot="top-nav-end" className={styles.endCluster}>
        {/* Search icon button matching benchmark */}
        {searchSlot !== undefined ? (
          searchSlot
        ) : (
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Search"
            title="Search"
            onClick={onSearchClick}
          >
            <Search size={18} aria-hidden="true" />
          </button>
        )}

        {/* Dark / Light mode switch icon */}
        {showThemeToggle && <ThemeQuickToggle className={styles.iconButton} />}

        {/* Notifications Bell button with red badge matching benchmark */}
        {actions !== undefined ? (
          actions
        ) : hasNotifications ? (
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Notifications (1 unread)"
            title="Notifications"
            onClick={onNotificationClick}
          >
            <Bell size={18} aria-hidden="true" />
            <span className={styles.notificationDot} aria-hidden="true" />
          </button>
        ) : null}

        {/* Optional Scope Pill when tenant information is provided */}
        {effectiveShowTenantScope && (tenant || environmentLabel || realmLabel) && (
          <div data-slot="top-nav-scope" className={styles.scopeContainer}>
            <button
              type="button"
              onClick={toggleTenantMenu}
              className={styles.scopePill}
              aria-haspopup="menu"
              aria-expanded={tenantMenuOpen}
              aria-label="Current operating scope"
            >
              {tenant && <span>{tenant.name}</span>}
              {environmentLabel && (
                <>
                  <span aria-hidden="true">/</span>
                  <span className={styles.scopeLabel}>{environmentLabel}</span>
                </>
              )}
              {realmLabel && (
                <>
                  <span aria-hidden="true">/</span>
                  <span className={styles.scopeLabel}>{realmLabel}</span>
                </>
              )}
              {availableTenants && availableTenants.length > 1 && (
                <ChevronDown size={14} aria-hidden="true" />
              )}
            </button>
            {tenant &&
              tenantMenuOpen &&
              availableTenants &&
              availableTenants.length > 1 && (
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
            className={styles.iconButton}
            aria-label="Switch platform"
            title="Switch platform"
          >
            <LayoutGrid size={18} aria-hidden="true" />
          </a>
        )}

        {/* Circular User Avatar with initials matching benchmark */}
        {userMenuSlot ? (
          userMenuSlot
        ) : (user || userInitials) ? (
          <div data-slot="top-nav-user" className={styles.userContainer}>
            <button
              type="button"
              onClick={toggleUserMenu}
              className={styles.userAvatarButton}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              aria-label="Account menu"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className={styles.userAvatarImage}
                />
              ) : (
                <span className={styles.avatarInitials} aria-hidden="true">
                  {computedInitials}
                </span>
              )}
              {presenceColor && (
                <span
                  className={styles.presenceDot}
                  style={{ backgroundColor: presenceColor }}
                  aria-hidden="true"
                />
              )}
            </button>
            {user && userMenuOpen && (
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
      </div>
    </header>
  );
});

TopNav.displayName = "TopNav";
