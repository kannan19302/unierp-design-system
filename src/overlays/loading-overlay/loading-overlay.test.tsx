import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { LoadingOverlay } from "./loading-overlay";

describe("LoadingOverlay Primitive", () => {
  it("renders status text and spinner when visible", () => {
    render(<LoadingOverlay visible={true} message="Generating Audit Report..." />);
    expect(screen.getByText("Generating Audit Report...")).toBeInTheDocument();
  });

  it("returns null when visible is false", () => {
    const { container } = render(<LoadingOverlay visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<LoadingOverlay visible={true} message="Loading" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
