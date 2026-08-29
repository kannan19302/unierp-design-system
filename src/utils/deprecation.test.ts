import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDeprecatedProp } from "./deprecation";

describe("useDeprecatedProp", () => {
  const originalEnv = process.env.NODE_ENV;
  let warnSpy: any;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it("warns in development when deprecated prop is supplied with defined value", () => {
    process.env.NODE_ENV = "development";
    renderHook(() => useDeprecatedProp("Button", "isPrimary", true, "variant='primary'"));

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain("[Deprecation Warning]");
    expect(warnSpy.mock.calls[0][0]).toContain("<Button isPrimary={...}> is deprecated");
    expect(warnSpy.mock.calls[0][0]).toContain("Please use <Button variant='primary'={...}> instead.");
  });

  it("does not warn when value is undefined", () => {
    process.env.NODE_ENV = "development";
    renderHook(() => useDeprecatedProp("Button", "isPrimary", undefined, "variant='primary'"));

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("does not warn in production environment", () => {
    process.env.NODE_ENV = "production";
    renderHook(() => useDeprecatedProp("Button", "isPrimary", true, "variant='primary'"));

    expect(warnSpy).not.toHaveBeenCalled();
  });
});
