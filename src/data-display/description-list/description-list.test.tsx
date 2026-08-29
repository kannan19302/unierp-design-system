import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { DescriptionList } from "./description-list";

describe("DescriptionList Primitive", () => {
  it("renders key value definition pairs", () => {
    render(
      <DescriptionList
        items={[
          { label: "Account Code", value: "1010-CASH" },
          { label: "Balance", value: "$45,000.00" },
        ]}
      />
    );
    expect(screen.getByText("Account Code")).toBeInTheDocument();
    expect(screen.getByText("1010-CASH")).toBeInTheDocument();
    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText("$45,000.00")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DescriptionList
        items={[{ label: "Status", value: "Active" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
