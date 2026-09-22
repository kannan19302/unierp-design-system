import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ListingDetailHeader } from "./listing-detail-header";

describe("ListingDetailHeader Component", () => {
  it("renders header with name and category", () => {
    render(
      <ListingDetailHeader
        name="Slack Notifications"
        publisher="Slack Tech"
        category="Collaboration"
        version="1.0.0"
      />
    );
    expect(screen.getByRole("region", { name: /marketplace listing/i })).toBeInTheDocument();
    expect(screen.getByText("Slack Notifications")).toBeInTheDocument();
    expect(screen.getByText("Collaboration")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ListingDetailHeader
        name="Accessible Connector"
        publisher="UniERP Labs"
        category="Integration"
        version="1.0.0"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
