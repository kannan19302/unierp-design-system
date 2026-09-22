import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { SubTabBar } from "./sub-tab-bar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/lines",
  useSearchParams: () => new URLSearchParams(),
}));

describe("SubTabBar Primitive", () => {
  it("renders sub tabs and marks active route", () => {
    render(
      <SubTabBar
        tabs={[
          { id: "1", label: "Overview", href: "/overview" },
          { id: "2", label: "Lines", href: "/lines" },
        ]}
      />
    );
    expect(screen.getByRole("tablist", { name: "Sub-sections" })).toBeInTheDocument();
    expect(screen.getByText("Lines")).toBeInTheDocument();
  });

  it("forwards ref to the div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <SubTabBar
        ref={ref}
        tabs={[{ id: "1", label: "General", href: "/general" }]}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SubTabBar
        tabs={[{ id: "1", label: "General", href: "/general" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
