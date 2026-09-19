import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { MultiPageDashboard, type DashboardPage } from "./multi-page-dashboard";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

const MOCK_PAGES: DashboardPage[] = [
  { id: "exec", title: "Executive Overview", content: <div>Exec Metrics</div> },
  { id: "ops", title: "Operations", content: <div>Ops Metrics</div> },
];

describe("MultiPageDashboard Primitive", () => {
  it("renders page tabs and content", () => {
    render(<MultiPageDashboard pages={MOCK_PAGES} defaultPageId="exec" />);

    expect(screen.getByText("Executive Overview")).toBeInTheDocument();
    expect(screen.getByText("Operations")).toBeInTheDocument();
    expect(screen.getByText("Exec Metrics")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  });

  it("forwards ref correctly to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MultiPageDashboard
        ref={ref}
        pages={MOCK_PAGES}
        defaultPageId="exec"
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <MultiPageDashboard pages={MOCK_PAGES} defaultPageId="exec" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
