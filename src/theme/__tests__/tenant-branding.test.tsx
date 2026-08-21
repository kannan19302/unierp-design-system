import { describe, it, expect, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider, useTheme } from "../theme-provider";

/**
 * M9's claim, made testable: **a tenant's brand overrides every Meridian token.**
 *
 * This matters because anatomy 9 (Tenant Websites) is a surface where UniERP's
 * design language must NOT win. A visitor on `careers.acme.com` is looking at
 * Acme's site, not at ours; if our teal leaked through their brand the product
 * would be putting its own identity on a customer's storefront.
 *
 * The mechanism is `applyBranding` writing to `document.documentElement.style`.
 * Inline properties on the root element beat every selector in every
 * stylesheet, `[data-theme="meridian"]` included — that is cascade, not luck,
 * and this test pins it so a refactor to (say) injecting a `<style>` block
 * instead cannot silently reverse it.
 */

function Harness() {
  const { applyBranding, clearBranding } = useTheme();
  return (
    <>
      <button
        onClick={() =>
          applyBranding({
            "--color-primary": "#ff6600",
            "--color-bg": "#fffdf7",
          })
        }
      >
        Apply Acme brand
      </button>
      <button onClick={clearBranding}>Clear brand</button>
    </>
  );
}

const root = () => document.documentElement;

afterEach(() => {
  root().removeAttribute("style");
  root().removeAttribute("data-theme");
  window.localStorage.clear();
  document.querySelectorAll("style[data-test-theme]").forEach((n) => n.remove());
});

describe("tenant branding over Meridian", () => {
  it("writes brand tokens as INLINE properties on the root element", () => {
    render(
      <ThemeProvider>
        <Harness />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByRole("button", { name: "Apply Acme brand" }).click();
    });

    // Inline, not a stylesheet rule. This is the whole override mechanism.
    expect(root().style.getPropertyValue("--color-primary")).toBe("#ff6600");
    expect(root().style.getPropertyValue("--color-bg")).toBe("#fffdf7");
  });

  it("BEATS a [data-theme=meridian] rule in the cascade", () => {
    // Stand in a real Meridian-shaped rule, then brand over it.
    const style = document.createElement("style");
    style.setAttribute("data-test-theme", "");
    style.textContent = `[data-theme="meridian"]{--color-primary:#0e6b75;}`;
    document.head.appendChild(style);
    root().setAttribute("data-theme", "meridian");

    render(
      <ThemeProvider>
        <Harness />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByRole("button", { name: "Apply Acme brand" }).click();
    });

    const resolved = getComputedStyle(root()).getPropertyValue("--color-primary").trim();
    expect(resolved).toBe("#ff6600");
    expect(resolved).not.toBe("#0e6b75");
  });

  it("restores the theme's own value when the brand is cleared", () => {
    render(
      <ThemeProvider>
        <Harness />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByRole("button", { name: "Apply Acme brand" }).click();
    });
    expect(root().style.getPropertyValue("--color-primary")).toBe("#ff6600");

    act(() => {
      screen.getByRole("button", { name: "Clear brand" }).click();
    });
    // Removed, not overwritten with a guess — the theme underneath takes over.
    expect(root().style.getPropertyValue("--color-primary")).toBe("");
  });

  it("persists the brand so a reload does not flash our palette first", () => {
    render(
      <ThemeProvider>
        <Harness />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByRole("button", { name: "Apply Acme brand" }).click();
    });

    // A tenant site that renders UniERP teal for one frame before the brand
    // arrives has still shown the visitor the wrong company's colour.
    const stored = JSON.parse(window.localStorage.getItem("unerp.branding") ?? "{}");
    expect(stored["--color-primary"]).toBe("#ff6600");
  });
});
