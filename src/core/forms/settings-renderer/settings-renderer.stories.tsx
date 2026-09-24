import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SettingsPage, type SettingSchemaEntry } from "./settings-renderer";

/**
 * SettingsPage renders a configuration experience from a declarative settings schema,
 * complete with search filtering, scope badge tags, dependency-driven visibility, and reset-to-default.
 */
const MOCK_SCHEMA: SettingSchemaEntry[] = [
  {
    key: "app.notifications.enabled",
    owner: "notifications",
    category: "Notifications",
    type: "boolean",
    scopes: ["USER", "TENANT"],
    defaultValue: true,
    permission: "settings:edit",
    helpText: "Send email and in-app notifications for workflow actions",
    version: 1,
  },
  {
    key: "app.notifications.frequency",
    owner: "notifications",
    category: "Notifications",
    type: "enum",
    scopes: ["USER"],
    defaultValue: "daily",
    permission: "settings:edit",
    helpText: "Digest delivery frequency",
    validation: { enumValues: ["instant", "daily", "weekly"] },
    dependsOn: ["app.notifications.enabled"],
    version: 1,
  },
  {
    key: "app.security.sessionTimeout",
    owner: "security",
    category: "Security",
    type: "number",
    scopes: ["TENANT"],
    defaultValue: 30,
    permission: "admin:edit",
    helpText: "Idle session timeout in minutes (5 - 120)",
    validation: { min: 5, max: 120 },
    version: 1,
  },
  {
    key: "app.appearance.customCss",
    owner: "appearance",
    category: "Appearance",
    type: "string",
    scopes: ["ORGANIZATION"],
    defaultValue: "/* custom corporate styles */",
    permission: "theme:edit",
    helpText: "Tenant-wide CSS injection for custom branding",
    version: 1,
  },
];

const meta: Meta<typeof SettingsPage> = {
  title: "Core/Forms/SettingsRenderer",
  component: SettingsPage,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Enterprise settings page renderer that maps schema definitions into searchable, categorized, scoped preference forms.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SettingsPage>;

export const Default: Story = {
  render: () => {
    const [values, setValues] = useState<Record<string, unknown>>({
      "app.notifications.enabled": true,
      "app.notifications.frequency": "daily",
      "app.security.sessionTimeout": 45,
      "app.appearance.customCss": "/* custom corporate styles */",
    });

    return (
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "var(--space-4)" }}>
        <SettingsPage
          schema={MOCK_SCHEMA}
          values={values}
          onChange={(k, v) => setValues((prev) => ({ ...prev, [k]: v }))}
          onResetToDefault={(k) => {
            const entry = MOCK_SCHEMA.find((s) => s.key === k);
            if (entry) setValues((prev) => ({ ...prev, [k]: entry.defaultValue }));
          }}
        />
      </div>
    );
  },
};

export const WithDirtyState: Story = {
  render: () => {
    const [values, setValues] = useState<Record<string, unknown>>({
      "app.notifications.enabled": false,
      "app.notifications.frequency": "instant",
      "app.security.sessionTimeout": 60,
    });
    const dirty = new Set(["app.notifications.enabled", "app.notifications.frequency", "app.security.sessionTimeout"]);

    return (
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "var(--space-4)" }}>
        <SettingsPage
          schema={MOCK_SCHEMA}
          values={values}
          dirtyKeys={dirty}
          onChange={(k, v) => setValues((prev) => ({ ...prev, [k]: v }))}
          onResetToDefault={(k) => {
            const entry = MOCK_SCHEMA.find((s) => s.key === k);
            if (entry) setValues((prev) => ({ ...prev, [k]: entry.defaultValue }));
          }}
        />
      </div>
    );
  },
};

export const AllStatesGallery: Story = {
  render: () => {
    const [vals, setVals] = useState<Record<string, unknown>>({
      "app.notifications.enabled": true,
      "app.notifications.frequency": "weekly",
      "app.security.sessionTimeout": 15,
    });

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", maxWidth: 700 }}>
        <div>
          <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
            Standard Interactive Configuration Page
          </h4>
          <SettingsPage
            schema={MOCK_SCHEMA}
            values={vals}
            onChange={(k, v) => setVals((p) => ({ ...p, [k]: v }))}
            onResetToDefault={(k) => {
              const e = MOCK_SCHEMA.find((s) => s.key === k);
              if (e) setVals((p) => ({ ...p, [k]: e.defaultValue }));
            }}
          />
        </div>
      </div>
    );
  },
};
