import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ExtensionCard } from "./extension-card";

describe("ExtensionCard Component", () => {
  it("renders article role with title and publisher", () => {
    render(<ExtensionCard name="Stripe Billing" publisher="Stripe Inc" />);
    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByText("Stripe Billing")).toBeInTheDocument();
    expect(screen.getByText("Stripe Inc")).toBeInTheDocument();
  });

  it("calls onInstall when install button is clicked", () => {
    const onInstall = vi.fn();
    render(<ExtensionCard name="QuickBooks" publisher="Intuit" onInstall={onInstall} />);
    const btn = screen.getByRole("button", { name: /install extension/i });
    fireEvent.click(btn);
    expect(onInstall).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ExtensionCard name="HubSpot Sync" publisher="HubSpot" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
