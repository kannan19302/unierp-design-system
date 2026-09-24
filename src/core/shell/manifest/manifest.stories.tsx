import type { Meta, StoryObj } from "@storybook/react";
import { resolveManifestNav, type PlatformManifest } from "./manifest";
import styles from "./manifest.module.css";

const MOCK_MANIFEST: PlatformManifest = {
  platformCode: "P1",
  platformName: "Provider Admin OS",
  nav: [
    { key: "dashboard", label: "Dashboard", href: "/dashboard" },
    {
      key: "tenants",
      label: "Tenants",
      href: "/tenants",
      requiredPermissions: ["tenants.read"],
      children: [
        { key: "all-tenants", label: "All Tenants", href: "/tenants/all" },
        {
          key: "provision",
          label: "Provision New",
          href: "/tenants/new",
          requiredPermissions: ["tenants.write"],
        },
      ],
    },
    {
      key: "security",
      label: "Security & Keys",
      href: "/security",
      requiredPermissions: ["security.admin"],
    },
  ],
  routePermissions: {
    "/tenants": ["tenants.read"],
    "/tenants/new": ["tenants.write"],
    "/security": ["security.admin"],
  },
};

const ManifestView = ({ heldPermissions }: { heldPermissions: string[] }) => {
  const resolved = resolveManifestNav(MOCK_MANIFEST, heldPermissions);

  return (
    <div className={styles.container} style={{ width: 480 }}>
      <h4 style={{ margin: "0 0 var(--space-1) 0" }}>Platform Manifest Nav Resolver</h4>
      <p style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-xs)", color: "var(--color-fg-muted)" }}>
        Active User Permissions: <code>{heldPermissions.length ? heldPermissions.join(", ") : "(None)"}</code>
      </p>
      <div>
        <strong style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-fg-muted)" }}>
          Rendered Navigation Items ({resolved.length})
        </strong>
        <ul className={styles.treeList} style={{ marginTop: "var(--space-2)" }}>
          {resolved.map((item) => (
            <li key={item.key}>
              <span style={{ fontWeight: 500 }}>{item.label}</span>{" "}
              <code style={{ fontSize: "var(--text-xs)", color: "var(--color-fg-muted)" }}>{item.href}</code>
              {item.children && (
                <ul className={styles.treeList} style={{ marginTop: "var(--space-1)" }}>
                  {item.children.map((child) => (
                    <li key={child.key}>
                      <span>{child.label}</span>{" "}
                      <code style={{ fontSize: "var(--text-xs)", color: "var(--color-fg-muted)" }}>{child.href}</code>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/**
 * Platform manifest engine for resolving role-based navigation trees against user permissions.
 */
const meta: Meta = {
  title: "Core/Shell/Manifest",
  component: ManifestView,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shell manifest navigation engine that prunes and filters multi-tier navigation hierarchies based on active tenant/user permission scopes.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ManifestView heldPermissions={["tenants.read", "tenants.write"]} />,
};

export const AdminAllPermissions: Story = {
  render: () => <ManifestView heldPermissions={["tenants.read", "tenants.write", "security.admin"]} />,
};

export const ReadOnlyPermissions: Story = {
  render: () => <ManifestView heldPermissions={["tenants.read"]} />,
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Super Admin Scope
        </h4>
        <ManifestView heldPermissions={["tenants.read", "tenants.write", "security.admin"]} />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Unprivileged Guest Scope
        </h4>
        <ManifestView heldPermissions={[]} />
      </div>
    </div>
  ),
};
