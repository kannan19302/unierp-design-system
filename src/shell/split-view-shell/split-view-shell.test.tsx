import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { SplitViewShell } from "./split-view-shell";

describe("SplitViewShell", () => {
  it("renders master and detail panes cleanly", () => {
    const { getByText } = render(
      <SplitViewShell
        masterHeader={<div>Queue</div>}
        masterContent={<div>Item 1</div>}
        detailContent={<div>Details</div>}
      />,
    );
    expect(getByText("Queue")).toBeDefined();
    expect(getByText("Item 1")).toBeDefined();
    expect(getByText("Details")).toBeDefined();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SplitViewShell
        masterHeader={<div>Queue</div>}
        masterContent={<div>Item 1</div>}
        detailContent={<div>Details</div>}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
