import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SystemStatusBar } from "./system-status-bar";

const defaultProps = {} as any;

describe("SystemStatusBar", () => {
  it("renders without crashing", () => {
    render(<SystemStatusBar {...defaultProps} status="operational" lastChecked="30s ago" />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<SystemStatusBar {...defaultProps} status="operational" lastChecked="30s ago" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
