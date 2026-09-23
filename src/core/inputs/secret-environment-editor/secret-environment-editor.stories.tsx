import type { Meta, StoryObj } from "@storybook/react";
import { SecretEnvironmentEditor } from "./secret-environment-editor";
import type { SecretItem } from "./secret-environment-editor";

const mockSecrets: SecretItem[] = [
  {
    id: "sec-1",
    key: "DATABASE_URL",
    value: "postgresql://postgres:p4ssw0rd@cluster-us-east-1.rds.amazonaws.com:5432/unierp_prod",
    scope: "production",
    updatedAt: "2026-09-01",
  },
  {
    id: "sec-2",
    key: "STRIPE_SECRET_KEY",
    value: "REDACTED_STRIPE_PLACEHOLDER_DO_NOT_USE",
    scope: "production",
    updatedAt: "2026-09-02",
  },
  {
    id: "sec-3",
    key: "JWT_SIGNING_SECRET",
    value: "super-secret-hmac-sha256-key-with-enterprise-entropy",
    scope: "all",
    updatedAt: "2026-09-03",
  },
  {
    id: "sec-4",
    key: "STAGING_API_ENDPOINT",
    value: "https://staging-api.internal.unierp.io/v1",
    scope: "staging",
    updatedAt: "2026-09-04",
  },
  {
    id: "sec-5",
    key: "LOCAL_REDIS_PASSWORD",
    value: "dev_redis_insecure_local_pw",
    scope: "development",
    updatedAt: "2026-09-05",
  },
];

/**
 * `SecretEnvironmentEditor` provides enterprise credential management with masked secret values,
 * instant clipboard copy, bulk .env file import parsing, and multi-environment scoping (production, staging, dev).
 *
 * ### Architectural Features
 * - **Masked Security by Default**: Obfuscates credentials until explicit toggle.
 * - **Clipboard Integration**: Instant copy with visual checkmark confirmation.
 * - **Environment Scope Filtering**: Instant tab filtering by production/staging/dev deployments.
 */
const meta: Meta<typeof SecretEnvironmentEditor> = {
  title: "Core/Inputs/SecretEnvironmentEditor",
  component: SecretEnvironmentEditor,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "High-density environment variable and secret manager with masking, copying, and bulk .env importing.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Header title displayed at the top of the editor table",
    },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Table density padding scale",
    },
    defaultScope: {
      control: "select",
      options: ["all", "production", "staging", "development"],
      description: "Initial active environment filter scope",
    },
    initialSecrets: {
      control: "object",
      description: "List of secret credentials",
    },
    onChange: {
      action: "secretsChanged",
      description: "Callback invoked when secrets are added, edited, or removed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SecretEnvironmentEditor>;

export const ProductionSecrets: Story = {
  args: {
    initialSecrets: mockSecrets,
    defaultScope: "all",
    density: "compact",
  },
};

export const HighDensityUltraCompact: Story = {
  args: {
    initialSecrets: mockSecrets,
    defaultScope: "production",
    density: "ultra-compact",
  },
};

export const EmptyState: Story = {
  args: {
    initialSecrets: [],
    defaultScope: "development",
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", maxWidth: 840 }}>
      <div style={{ padding: "var(--space-md)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
        <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "bold", color: "var(--color-fg-muted)", marginBottom: "var(--space-xs)" }}>
          ANATOMY: SCOPE TABS / BULK IMPORT / HIGH DENSITY CREDENTIAL DATA GRID
        </div>
        <SecretEnvironmentEditor
          title="Cluster Deployment Credentials"
          initialSecrets={mockSecrets.slice(0, 3)}
          density="compact"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)", maxWidth: 860 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Ultra-Compact Mode (ERP Data-Grid Density)
        </h4>
        <SecretEnvironmentEditor
          initialSecrets={mockSecrets}
          defaultScope="production"
          density="ultra-compact"
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Comfortable Mode (Spaced Workspace)
        </h4>
        <SecretEnvironmentEditor
          initialSecrets={mockSecrets.slice(0, 2)}
          defaultScope="all"
          density="comfortable"
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Empty State
        </h4>
        <SecretEnvironmentEditor
          initialSecrets={[]}
          defaultScope="development"
          density="compact"
        />
      </div>
    </div>
  ),
};
