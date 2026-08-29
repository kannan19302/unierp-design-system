import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SettingsPage, type SettingSchemaEntry } from "./settings-renderer";

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
];

const SettingsDemo = () => {
  const [values, setValues] = useState<Record<string, unknown>>({
    "app.notifications.enabled": true,
    "app.notifications.frequency": "daily",
    "app.security.sessionTimeout": 45,
  });

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "var(--space-4)" }}>
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
};

const meta: Meta<typeof SettingsPage> = {
  title: "FormEngine/SettingsPage",
  component: SettingsDemo,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <SettingsDemo />,
};
