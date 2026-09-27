import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn utility", () => {
  it("joins valid class names with space", () => {
    expect(cn("btn", "btn-primary", "active")).toBe("btn btn-primary active");
  });

  it("filters out falsy values (false, null, undefined, empty string)", () => {
    expect(cn("base", false, null, undefined, "", "extra")).toBe("base extra");
  });

  it("returns empty string if no arguments or all falsy", () => {
    expect(cn()).toBe("");
    expect(cn(false, null, undefined)).toBe("");
  });

  it("supports conditional objects", () => {
    expect(cn("btn", { "btn-primary": true, "btn-disabled": false, active: true })).toBe(
      "btn btn-primary active"
    );
  });

  it("supports nested arrays", () => {
    expect(cn(["btn", ["btn-lg", false, "shadow"]], { rounded: true })).toBe(
      "btn btn-lg shadow rounded"
    );
  });
});
