import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatPercent,
  truncate,
  formatCurrency,
  formatCompactNumber,
  formatIndianNumber,
  formatEnterpriseDate,
} from "./format";

describe("Enterprise Formatters", () => {
  it("formats standard numbers and percentages", () => {
    expect(formatNumber(12500)).toBe("12,500");
    expect(formatPercent(0.456)).toBe("45.6%");
    expect(formatPercent(75, 0, false)).toBe("75%");
  });

  it("truncates long strings with ellipsis", () => {
    expect(truncate("Hello World", 5)).toBe("Hell…");
    expect(truncate("Short", 10)).toBe("Short");
  });

  it("formats enterprise currencies with ISO decimal precision and accounting format", () => {
    expect(formatCurrency(1250.5, { currency: "USD" })).toBe("$1,250.50");
    expect(formatCurrency(5000, { currency: "JPY" })).toBe("¥5,000");
    expect(formatCurrency(12.345, { currency: "KWD" })).toBe("KWD 12.345");
    expect(formatCurrency(-1500, { currency: "USD", accountingFormat: true })).toBe("($1,500.00)");
    expect(formatCurrency(-1500, { currency: "USD", accountingFormat: false })).toBe("-$1,500.00");
  });

  it("formats compact metrics", () => {
    expect(formatCompactNumber(1200000)).toBe("1.2M");
    expect(formatCompactNumber(450000)).toBe("450K");
  });

  it("formats Indian numbering system (Lakhs and Crores)", () => {
    expect(formatIndianNumber(1234567.89)).toBe("12,34,567.89");
  });

  it("formats enterprise dates across Gregorian and alternate calendar systems", () => {
    const testDate = new Date("2026-08-29T12:00:00Z");
    const formatted = formatEnterpriseDate(testDate, "en-US", "gregory");
    expect(formatted).toContain("2026");
  });
});
