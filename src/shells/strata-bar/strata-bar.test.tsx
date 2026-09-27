import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { StrataBar } from "./strata-bar";
import { MeridianBar } from "./meridian-bar";

describe("StrataBar", () => {
  it("renders segments and terminal correctly", () => {
    const { getByText } = render(
      <StrataBar segments={["acme", "finance", "INV-100"]} />,
    );
    expect(getByText("acme")).toBeDefined();
    expect(getByText("INV-100")).toBeDefined();
  });

  it("renders status pill and action", () => {
    const { getByText } = render(
      <StrataBar
        segments={["acme", "finance"]}
        state={{ kind: "success", label: "Approved" }}
        action={<button>Post</button>}
      />,
    );
    expect(getByText("Approved")).toBeDefined();
    expect(getByText("Post")).toBeDefined();
  });

  it("annotates slots with data-slot attributes", () => {
    const { container } = render(
      <StrataBar
        segments={["acme", "finance", "INV-100"]}
        state={{ kind: "info", label: "Open" }}
        lifecycle={[{ id: "s1", label: "Review", active: true }]}
        activeUsers={["KP", "AL"]}
        action={<button>Review</button>}
      />,
    );
    expect(container.querySelector('[data-slot="strata-bar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="strata-bar-identity"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="strata-bar-segments"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="strata-bar-copy-btn"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="strata-bar-center"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="strata-bar-lifecycle"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="strata-bar-path-step"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="strata-bar-state-pill"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="strata-bar-state-dot"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="strata-bar-right"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="strata-bar-avatars"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="strata-bar-action"]')).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(
      <StrataBar segments={["acme", "orders"]} density="compact" />,
    );
    const root = container.querySelector('[data-slot="strata-bar"]');
    expect(root).toHaveAttribute("data-density", "compact");
    expect(root?.className).toContain("density_compact");

    rerender(<StrataBar segments={["acme", "orders"]} density="ultra-compact" />);
    expect(root).toHaveAttribute("data-density", "ultra-compact");
    expect(root?.className).toContain("density_ultra_compact");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <StrataBar
        segments={["acme", "finance", "INV-100"]}
        state={{ kind: "info", label: "Open" }}
        action={<button>Review</button>}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("MeridianBar", () => {
  it("renders segments and leaf correctly", () => {
    render(
      <MeridianBar
        segments={[{ label: "acme" }, { label: "finance" }, { label: "INV-2043" }]}
      />,
    );
    expect(screen.getByText("acme")).toBeInTheDocument();
    expect(screen.getByText("INV-2043")).toBeInTheDocument();
  });

  it("annotates slots with data-slot attributes", () => {
    const { container } = render(
      <MeridianBar
        segments={[{ label: "acme" }, { label: "INV-2043" }]}
        copyable
        state={{ label: "Pending", tone: "warning" }}
        action={{ label: "Approve", onClick: () => {} }}
      />,
    );
    expect(container.querySelector('[data-slot="meridian-bar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="meridian-bar-identity"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="meridian-bar-segments"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="meridian-bar-copy-btn"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="meridian-bar-state"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="meridian-bar-action-slot"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="meridian-bar-verb"]')).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(
      <MeridianBar segments={[{ label: "acme" }]} density="compact" />,
    );
    const root = container.querySelector('[data-slot="meridian-bar"]');
    expect(root).toHaveAttribute("data-density", "compact");
    expect(root?.className).toContain("density_compact");

    rerender(<MeridianBar segments={[{ label: "acme" }]} density="ultra-compact" />);
    expect(root).toHaveAttribute("data-density", "ultra-compact");
    expect(root?.className).toContain("density_ultra_compact");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <MeridianBar
        segments={[{ label: "acme" }, { label: "finance" }, { label: "INV-2043" }]}
        copyable
        state={{ label: "Ready", tone: "success" }}
        action={{ label: "Publish", onClick: () => {} }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

