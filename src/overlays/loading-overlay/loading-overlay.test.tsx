import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { LoadingOverlay } from "./loading-overlay";

describe("LoadingOverlay Primitive", () => {
  it("renders status text and spinner when visible", () => {
    render(<LoadingOverlay visible={true} message="Generating Audit Report..." />);
    expect(screen.getByText("Generating Audit Report...")).toBeInTheDocument();
  });

  it("renders anatomy data-slot attributes correctly", () => {
    render(
      <LoadingOverlay
        visible={true}
        density="compact"
        message="Generating Audit Report..."
      />
    );
    const overlay = document.querySelector('[data-slot="loading-overlay"]');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute("data-density", "compact");
    expect(document.querySelector('[data-slot="loading-overlay-dialog"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="loading-overlay-spinner"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="loading-overlay-message"]')).toBeInTheDocument();
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
