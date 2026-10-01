import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StrataAppGrid } from "./strata-app-grid";

describe("StrataAppGrid", () => {
  it("renders consumer supplied links and app names", () => {
    render(
      <StrataAppGrid
        apps={[{ id: "finance", icon: "F", name: "Finance", description: "Ledger", href: "/finance" }]}
      />,
    );

    expect(screen.getByRole("navigation", { name: "Applications" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Finance Ledger/ })).toHaveAttribute("href", "/finance");
  });

  it("renders an explicit empty state without inventing app entries", () => {
    render(<StrataAppGrid apps={[]} />);

    expect(screen.getByRole("status")).toHaveTextContent("No applications are available.");
    expect(screen.queryByRole("link")).toBeNull();
  });
});
