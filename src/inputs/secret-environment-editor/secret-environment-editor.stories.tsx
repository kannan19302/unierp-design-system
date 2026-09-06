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

const meta: Meta<typeof SecretEnvironmentEditor> = {
  title: "Inputs/SecretEnvironmentEditor",
  component: SecretEnvironmentEditor,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
    defaultScope: {
      control: "select",
      options: ["all", "production", "staging", "development"],
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
