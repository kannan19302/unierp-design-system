import { describe, it, expect } from "vitest";
import { getContrastRatio, validateTenantBrandContrast } from "./branding";

describe("Branding Utilities", () => {
  it("calculates contrast ratios between colors accurately", () => {
    // Black and white should have maximum contrast (~21:1)
    const ratio = getContrastRatio("#000000", "#ffffff");
    expect(ratio).toBeGreaterThan(20);
  });

  it("validates compliant contrast for WCAG AA", () => {
    const res = validateTenantBrandContrast("#0f172a", "#ffffff");
    expect(res.valid).toBe(true);
    expect(res.ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("rejects non-compliant contrast ratios", () => {
    const res = validateTenantBrandContrast("#fbbf24", "#ffffff");
    expect(res.valid).toBe(false);
    expect(res.error).toBeDefined();
  });
});
