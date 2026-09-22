import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { StudioConsole, type StudioProblem } from "./studio-console";

const MOCK_PROBLEMS: StudioProblem[] = [
  {
    id: "p1",
    severity: "error",
    message: "Missing required property 'title'",
    where: "Hero Block",
    targetId: "node-hero",
  },
  {
    id: "p2",
    severity: "warning",
    message: "Contrast ratio below 4.5:1",
    where: "Button Text",
    targetId: "node-btn",
  },
];

describe("StudioConsole Primitive", () => {
  it("renders problem tabs, error counts, and handles locate", () => {
    const onLocate = vi.fn();
    render(
      <StudioConsole
        problems={MOCK_PROBLEMS}
        defaultOpen={true}
        onLocate={onLocate}
      />
    );

    expect(screen.getByText("Missing required property 'title'")).toBeInTheDocument();
    expect(screen.getByText("Contrast ratio below 4.5:1")).toBeInTheDocument();

    const locateBtn = screen.getByText("Missing required property 'title'");
    fireEvent.click(locateBtn);
    expect(onLocate).toHaveBeenCalledWith("node-hero");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <StudioConsole problems={MOCK_PROBLEMS} defaultOpen={true} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
