import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  SecurityWafRuleInspector,
  WafSecurityEventItem,
} from "./security-waf-rule-inspector";

const sampleEvents: WafSecurityEventItem[] = [
  {
    id: "waf_evt_8841",
    timestamp: "2026-09-06 05:22:14 UTC",
    clientIp: "198.51.100.42",
    countryIso: "RO",
    uriPath: "/api/v1/auth/login",
    httpMethod: "POST",
    threatCategory: "SQL_INJECTION",
    ruleMatched: "OWASP CRS 942100: SQLi Operator Detected",
    actionTaken: "BLOCKED",
    asnNumber: 13335,
  },
  {
    id: "waf_evt_8842",
    timestamp: "2026-09-06 05:21:50 UTC",
    clientIp: "203.0.113.19",
    countryIso: "RU",
    uriPath: "/api/v1/search",
    httpMethod: "GET",
    threatCategory: "XSS_SCRIPTING",
    ruleMatched: "OWASP CRS 941110: XSS Filter Evasion",
    actionTaken: "BLOCKED",
    asnNumber: 42890,
  },
];

describe("SecurityWafRuleInspector", () => {
  it("renders WAF events and threat counts truthfully", () => {
    render(<SecurityWafRuleInspector events={sampleEvents} />);
    expect(
      screen.getByText(/Edge Web Application Firewall Threat Stream/i)
    ).toBeInTheDocument();
    expect(screen.getByText("198.51.100.42")).toBeInTheDocument();
    expect(screen.getByText("203.0.113.19")).toBeInTheDocument();
    expect(screen.getByText("2 Threats Blocked")).toBeInTheDocument();
  });

  it("handles filtering by threat signature and blocking an IP", () => {
    const handleBlock = vi.fn();
    render(
      <SecurityWafRuleInspector events={sampleEvents} onBlockIp={handleBlock} />
    );

    const filter = screen.getByLabelText(/Filter Threat:/i);
    fireEvent.change(filter, { target: { value: "SQL_INJECTION" } });
    expect(screen.getByText("198.51.100.42")).toBeInTheDocument();
    expect(screen.queryByText("203.0.113.19")).not.toBeInTheDocument();

    const blockBtn = screen.getByRole("button", {
      name: "Permanently block IP 198.51.100.42",
    });
    fireEvent.click(blockBtn);
    expect(handleBlock).toHaveBeenCalledWith("198.51.100.42");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<SecurityWafRuleInspector events={sampleEvents} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
