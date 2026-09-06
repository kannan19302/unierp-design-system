import type { Meta, StoryObj } from "@storybook/react";
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
    ruleMatched: "OWASP CRS 942100: SQLi Operator Detected (UNION SELECT)",
    actionTaken: "BLOCKED",
    asnNumber: 13335,
  },
  {
    id: "waf_evt_8842",
    timestamp: "2026-09-06 05:21:50 UTC",
    clientIp: "203.0.113.19",
    countryIso: "RU",
    uriPath: "/api/v1/search?q=%3Cscript%3Ealert(1)%3C/script%3E",
    httpMethod: "GET",
    threatCategory: "XSS_SCRIPTING",
    ruleMatched: "OWASP CRS 941110: XSS Filter Evasion (Script Tag Injection)",
    actionTaken: "BLOCKED",
    asnNumber: 42890,
  },
  {
    id: "waf_evt_8843",
    timestamp: "2026-09-06 05:20:10 UTC",
    clientIp: "192.0.2.78",
    countryIso: "CN",
    uriPath: "/api/v1/checkout/promo-code",
    httpMethod: "POST",
    threatCategory: "BAD_BOT",
    ruleMatched: "Cloudflare Bot Score 12: Automated Headless Chrome Scraper",
    actionTaken: "CHALLENGED",
    asnNumber: 4134,
  },
  {
    id: "waf_evt_8844",
    timestamp: "2026-09-06 05:18:45 UTC",
    clientIp: "198.51.100.99",
    countryIso: "US",
    uriPath: "/api/v1/customers/export",
    httpMethod: "GET",
    threatCategory: "RATE_ABUSE",
    ruleMatched: "Rate Limit 500 req/min exceeded on tenant endpoint",
    actionTaken: "CHALLENGED",
    asnNumber: 15169,
  },
];

const meta: Meta<typeof SecurityWafRuleInspector> = {
  title: "Workflow/SecurityWafRuleInspector",
  component: SecurityWafRuleInspector,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof SecurityWafRuleInspector>;

export const Default: Story = {
  args: {
    events: sampleEvents,
  },
};

export const UltraCompact: Story = {
  args: {
    events: sampleEvents,
    density: "ultra-compact",
  },
};
