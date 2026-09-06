import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  ApiRateLimitThrottleConsole,
  TenantApiQuota,
} from "./api-rate-limit-throttle-console";

const sampleQuotas: TenantApiQuota[] = [
  {
    tenantId: "cust_8910a",
    tenantName: "Apex Global Payments",
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
    tenantName: "Kinetics BioLabs",
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
];

describe("ApiRateLimitThrottleConsole", () => {
  it("renders gateway header, KPI metrics, and tenant quotas", () => {
    render(<ApiRateLimitThrottleConsole quotas={sampleQuotas} />);

    expect(screen.getByText("API Rate Limit & Token Bucket Throttling Console")).toBeDefined();
    expect(screen.getByText("Apex Global Payments")).toBeDefined();
    expect(screen.getByText("Kinetics BioLabs")).toBeDefined();
    expect(screen.getByText("+48")).toBeDefined();
  });

  it("toggles whitelist exemption when bypass/revoke button is clicked", () => {
    const handleToggle = vi.fn();

    render(
      <ApiRateLimitThrottleConsole
        quotas={sampleQuotas}
        onToggleWhitelist={handleToggle}
      />
    );

    const bypassBtn = screen.getByRole("button", {
      name: /Whitelist Kinetics BioLabs/i,
    });
    fireEvent.click(bypassBtn);

    expect(handleToggle).toHaveBeenCalledWith("cust_7411b", true);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ApiRateLimitThrottleConsole quotas={sampleQuotas} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
