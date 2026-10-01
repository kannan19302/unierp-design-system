import { forwardRef, useState } from "react";
import { Boxes, ChartNoAxesCombined, ClipboardList, FileText, House } from "lucide-react";
import { TopNav, type TopNavProps, type TopNavItem, type TopNavTenant } from "../../src/navigation/top-nav";

export interface TopNavReferenceProps extends Partial<TopNavProps> {
  withItems?: boolean;
}

const defaultNavItems: TopNavItem[] = [
  { id: "overview", label: "Overview", icon: <House size={16} aria-hidden="true" /> },
  { id: "work-orders", label: "Work orders", icon: <ClipboardList size={16} aria-hidden="true" /> },
  { id: "inventory", label: "Inventory", icon: <Boxes size={16} aria-hidden="true" /> },
  { id: "reports", label: "Reports", icon: <ChartNoAxesCombined size={16} aria-hidden="true" /> },
  { id: "documents", label: "Documents", icon: <FileText size={16} aria-hidden="true" /> },
];

const defaultBreadcrumbs = [
  { key: "home", label: "Home", href: "#home" },
  { key: "analytics", label: "Analytics", href: "#analytics" },
  { key: "overview", label: "Overview" },
];

const defaultTenants: TopNavTenant[] = [
  { id: "unierp", name: "UniERP" },
  { id: "enterprise", name: "UniERP Enterprise" },
  { id: "cloud", name: "UniERP Cloud" },
];

/**
 * `<TopNavReference>` — Interactive fixture component for Storybook shells and demos.
 * Exactly implements the benchmark design:
 * Left: hamburger toggle + vertical stack (Dashboard + Home > Analytics > Overview).
 * Right: Search icon button, Dark/Light mode switch, Notification bell with red badge, User avatar ("JD").
 */
export const TopNavReference = forwardRef<HTMLElement, TopNavReferenceProps>(({
  title = "Dashboard",
  breadcrumbs = defaultBreadcrumbs,
  withItems = false,
  items,
  activeItemId: controlledActiveItemId,
  onItemSelect,
  tenant: controlledTenant,
  availableTenants = defaultTenants,
  onTenantChange,
  user = { name: "John Doe", email: "john@unierp.example" },
  userInitials = "JD",
  showThemeToggle = true,
  hasNotifications = true,
  showTenantScope = false,
  ...rest
}, ref) => {
  const [activeItemId, setActiveItemId] = useState(controlledActiveItemId ?? "overview");
  const [selectedTenantId, setSelectedTenantId] = useState(controlledTenant?.id ?? "unierp");

  const effectiveTenant = controlledTenant !== undefined
    ? controlledTenant
    : availableTenants.find((t) => t.id === selectedTenantId) ?? availableTenants[0];

  const handleTenantChange = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    onTenantChange?.(tenantId);
  };

  const handleItemSelect = (item: TopNavItem) => {
    setActiveItemId(item.id);
    onItemSelect?.(item);
  };

  const effectiveItems = withItems
    ? (items ?? defaultNavItems).map((item) => ({
        ...item,
        active: item.id === (controlledActiveItemId ?? activeItemId),
      }))
    : items;

  return (
    <TopNav
      ref={ref}
      title={title}
      breadcrumbs={breadcrumbs}
      items={effectiveItems}
      activeItemId={controlledActiveItemId ?? activeItemId}
      onItemSelect={handleItemSelect}
      tenant={effectiveTenant}
      availableTenants={availableTenants}
      onTenantChange={handleTenantChange}
      showTenantScope={showTenantScope}
      user={user}
      userInitials={userInitials}
      showThemeToggle={showThemeToggle}
      hasNotifications={hasNotifications}
      accountCenterUrl="#account"
      presenceColor="var(--color-success)"
      {...rest}
    />
  );
});

TopNavReference.displayName = "TopNavReference";
