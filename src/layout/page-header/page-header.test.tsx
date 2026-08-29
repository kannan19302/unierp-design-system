import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { PageHeader } from "./page-header";

describe("PageHeader Primitive", () => {
  it("renders page header title, subtitle, and actions", () => {
    render(
      <PageHeader
        title="Fiscal Dashboard"
        subtitle="Overview of financial KPIs"
        actions={<button>Create</button>}
      />
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Fiscal Dashboard");
    expect(screen.getByText("Overview of financial KPIs")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <PageHeader title="Accessible Header" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
