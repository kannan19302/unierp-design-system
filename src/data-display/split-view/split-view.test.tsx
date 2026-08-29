import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SplitView } from "./split-view";

describe("SplitView Primitive", () => {
  it("renders left and right pane content", () => {
    render(<SplitView left={<div>Left View</div>} right={<div>Right View</div>} />);
    expect(screen.getByText("Left View")).toBeInTheDocument();
    expect(screen.getByText("Right View")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SplitView left={<div>Left</div>} right={<div>Right</div>} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
