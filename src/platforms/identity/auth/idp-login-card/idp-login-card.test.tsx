import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { IdpLoginCard } from "./idp-login-card";

describe("IdpLoginCard Component", () => {
  it("renders authentication portal with tenant info", () => {
    render(<IdpLoginCard tenantName="Test Org" title="Log in" />);
    expect(screen.getByRole("region", { name: /identity authentication portal/i })).toBeInTheDocument();
    expect(screen.getByText("Test Org")).toBeInTheDocument();
    expect(screen.getByText("Log in")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<IdpLoginCard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
