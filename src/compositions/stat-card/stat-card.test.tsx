import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { KPIStrip, StatCard, kpiStripVariants } from "./stat-card";

describe("KPIStrip & StatCard Component", () => {
  it("renders metric cards and handles clicks", () => {
    const onClick = vi.fn();
    render(
      <KPIStrip
        items={[
          { id: "1", label: "Revenue", value: "$100k", delta: "+5%", trend: "up", onClick },
        ]}
      />
    );
    expect(screen.getByRole("region", { name: "Key Performance Indicators" })).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$100k")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders single StatCard", () => {
    render(<StatCard id="kpi" label="Headcount" value="42" />);
    expect(screen.getByText("Headcount")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders data-slot annotations on anatomy", () => {
    const { container } = render(
      <KPIStrip
        items={[
          { id: "1", label: "Revenue", value: "$100k", delta: "+5%", trend: "up" },
        ]}
      />
    );
    expect(container.querySelector('[data-slot="kpi-strip"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="stat-card"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="stat-card-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="stat-card-label"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="stat-card-value"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="stat-card-trend"]')).toBeInTheDocument();
  });

  it("supports strict 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <KPIStrip
          density={density}
          items={[{ id: "1", label: "Margin", value: "24%" }]}
        />
      );
      const root = container.querySelector('[data-slot="kpi-strip"]');
      expect(root).toHaveAttribute("data-density", density);
    });

    const classes = kpiStripVariants({ density: "ultra-compact" });
    expect(classes).toContain("densityUltraCompact");
  });

  it("forwards ref to root element in KPIStrip and StatCard", () => {
    const stripRef = createRef<HTMLDivElement>();
    render(
      <KPIStrip
        ref={stripRef}
        items={[{ id: "1", label: "Margin", value: "24%" }]}
      />
    );
    expect(stripRef.current).toBeInstanceOf(HTMLDivElement);

    const cardRef = createRef<HTMLDivElement>();
    render(<StatCard ref={cardRef} id="kpi" label="Headcount" value="42" />);
    expect(cardRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <KPIStrip
        items={[{ id: "1", label: "Margin", value: "24%" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
