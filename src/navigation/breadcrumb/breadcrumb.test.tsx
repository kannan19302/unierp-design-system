import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Breadcrumb } from "./breadcrumb";

describe("Breadcrumb Primitive", () => {
  it("renders breadcrumb trail and marks current item", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Accounts", href: "/accounts" },
          { label: "1000 - Cash" },
        ]}
      />
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("1000 - Cash")).toHaveAttribute("aria-current", "page");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Ledger" },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
