import type { Meta, StoryObj } from "@storybook/react";
import {
  SecretVaultAccessMatrix,
  VaultSecretRecord,
} from "./secret-vault-access-matrix";

const meta: Meta<typeof SecretVaultAccessMatrix> = {
  title: "DataGrid/SecretVaultAccessMatrix",
  component: SecretVaultAccessMatrix,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SecretVaultAccessMatrix>;

const mockSecrets = [
  {
    id: "sec_1",
    keyName: "DATABASE_CONNECTION_URL",
    description: "PostgreSQL master Aurora cluster connection endpoint",
    environments: {
      PRODUCTION: { value: "postgresql://app:eX94812@db-prod.internal:5432/core", isSet: true },
      STAGING: { value: "postgresql://app:stg_pass@db-stg.internal:5432/core", isSet: true },
      DEVELOPMENT: { value: "postgresql://postgres:local@localhost:5432/dev", isSet: true },
    },
    rotationAgeDays: 45,
    lastRotatedBy: "secops.lead@unierp.com",
    securityTier: "RESTRICTED" as const,
  },
  {
    id: "sec_2",
    keyName: "STRIPE_SECRET_KEY",
    description: "Global merchant payment processing API key",
    environments: {
      PRODUCTION: { value: "sk_live_51MzaP09823141123490", isSet: true },
      STAGING: { value: "sk_test_51MzaP0982314TESTING", isSet: true },
      DEVELOPMENT: { value: "sk_test_mock_dev_000000000", isSet: true },
    },
    rotationAgeDays: 114, // >90d Overdue alert
    lastRotatedBy: "finance.automation@unierp.com",
    securityTier: "RESTRICTED" as const,
  },
  {
    id: "sec_3",
    keyName: "REDIS_CACHE_AUTH_TOKEN",
    description: "ElastiCache Redis session cache auth token",
    environments: {
      PRODUCTION: { value: "auth_token_redis_prod_88921", isSet: true },
      STAGING: { value: "auth_token_redis_stg_11029", isSet: true },
      DEVELOPMENT: { value: "", isSet: false },
    },
    rotationAgeDays: 18,
    lastRotatedBy: "cloud.infra@unierp.com",
    securityTier: "INTERNAL" as const,
  },
];

export const Default: Story = {
  args: {
    secrets: mockSecrets,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    secrets: mockSecrets,
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    secrets: mockSecrets,
    density: "comfortable",
  },
};
