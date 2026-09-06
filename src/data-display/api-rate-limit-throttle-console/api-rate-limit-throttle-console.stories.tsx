import type { Meta, StoryObj } from "@storybook/react";
import {
  ApiRateLimitThrottleConsole,
  TenantApiQuota,
} from "./api-rate-limit-throttle-console";

const sampleQuotas: TenantApiQuota[] = [
  {
    tenantId: "cust_8910a",
    tenantName: "Apex Global Payments Corp",
    apiKeyPrefix: "pk_live_51M...",
    tier: "tier_enterprise",
    currentRps: 142,
    limitRps: 200,
    burstLimit: 300,
    dailyUsageRequests: 4200000,
    dailyLimitRequests: 5000000,
    throttled429Count: 0,
    isWhitelisted: true,
  },
  {
    tenantId: "cust_7411b",
    tenantName: "Kinetics BioLabs Diagnostics",
    apiKeyPrefix: "pk_live_42A...",
    tier: "tier_pro",
    currentRps: 98,
    limitRps: 100,
    burstLimit: 120,
    dailyUsageRequests: 950000,
    dailyLimitRequests: 1000000,
    throttled429Count: 48,
    isWhitelisted: false,
  },
  {
    tenantId: "cust_3214c",
    tenantName: "Vanguard Supply Rail Logix",
    apiKeyPrefix: "pk_live_99F...",
    tier: "tier_standard",
    currentRps: 24,
    limitRps: 50,
    burstLimit: 75,
    dailyUsageRequests: 210000,
    dailyLimitRequests: 500000,
    throttled429Count: 0,
    isWhitelisted: false,
  },
];

const meta: Meta<typeof ApiRateLimitThrottleConsole> = {
  title: "Data Display/ApiRateLimitThrottleConsole",
  component: ApiRateLimitThrottleConsole,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: { type: "select" },
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ApiRateLimitThrottleConsole>;

export const Default: Story = {
  args: {
    gatewayHost: "api-edge.gateway.unierp.io",
    activeWindowMinutes: 60,
    quotas: sampleQuotas,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
