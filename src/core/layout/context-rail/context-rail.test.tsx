import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ContextRail } from "./context-rail";

describe("ContextRail Layout Component", () => {
  const tabs = [
    { id: "details", label: "Details", content: <div>Details Panel</div> },
    { id: "audit", label: "Audit", badge: 2, content: <div>Audit Log Panel</div> },
  ];

  it("renders tabs and active content", () => {
    render(<ContextRail title="Context Rail" tabs={tabs} />);
    expect(screen.getByText("Context Rail")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Details Panel")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ContextRail title="Context Rail" tabs={tabs} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
