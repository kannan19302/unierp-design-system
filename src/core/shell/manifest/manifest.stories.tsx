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

const ManifestDemo = () => {
  const held = ["tenants.read", "tenants.write"];
  const resolved = resolveManifestNav(MOCK_MANIFEST, held);

  return (
    <div className={styles.container}>
      <h3 style={{ margin: "0 0 var(--space-2) 0" }}>Platform Manifest Resolver</h3>
      <p style={{ margin: "0 0 var(--space-4) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Held Permissions: <code>{held.join(", ")}</code>
      </p>
      <div>
        <strong>Resolved Nav Hierarchy:</strong>
        <ul className={styles.treeList}>
          {resolved.map((item) => (
            <li key={item.key}>
              <span>{item.label} ({item.href})</span>
              {item.children && (
                <ul className={styles.treeList}>
                  {item.children.map((child) => (
                    <li key={child.key}>
                      <span>{child.label} ({child.href})</span>
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

const meta: Meta = {
  title: "Shell/PlatformManifest",
  component: ManifestDemo,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ManifestDemo />,
};
