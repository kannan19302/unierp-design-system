import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { AlertBanner } from "./alert-banner";

describe("AlertBanner", () => {
  it("renders without crashing with default props", () => {
    render(
      <AlertBanner
        variant="warning"
        title="Scheduled Maintenance"
        message="The system will be unavailable on Sept 7, 2026 from 2:00 AM - 4:00 AM UTC."
        action={{ label: "Learn More", onClick: () => {} }}
      />
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Scheduled Maintenance")).toBeInTheDocument();
    expect(screen.getByText("Learn More")).toBeInTheDocument();
  });

  it("renders anatomy data-slot attributes correctly", () => {
    render(
      <AlertBanner
        variant="info"
        title="Info Notice"
        message="Detailed message here"
        action={{ label: "Action", onClick: () => {} }}
        dismissible
      />
    );
    expect(document.querySelector('[data-slot="alert-banner"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="alert-banner-icon"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="alert-banner-content"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="alert-banner-title"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="alert-banner-message"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="alert-banner-action"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="alert-banner-dismiss"]')).toBeInTheDocument();
  });

  it("handles dismiss click event", () => {
    const handleDismiss = vi.fn();
    render(
      <AlertBanner
        title="Dismissible Alert"
        onDismiss={handleDismiss}
        dismissible
      />
    );
    const dismissBtn = screen.getByRole("button", { name: /dismiss alert/i });
    fireEvent.click(dismissBtn);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it("supports severity alias and maps danger to error", () => {
    render(<AlertBanner severity="danger" title="Critical Failure" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("data-variant", "error");
  });

  it("supports density variants", () => {
    const { rerender } = render(<AlertBanner density="ultra-compact" title="Compact" />);
    expect(screen.getByRole("alert")).toHaveAttribute("data-density", "ultra-compact");

    rerender(<AlertBanner density="comfortable" title="Comfortable" />);
    expect(screen.getByRole("alert")).toHaveAttribute("data-density", "comfortable");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <AlertBanner
        variant="warning"
        title="Scheduled Maintenance"
        message="The system will be unavailable on Sept 7, 2026 from 2:00 AM - 4:00 AM UTC."
        action={{ label: "Learn More", onClick: () => {} }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
