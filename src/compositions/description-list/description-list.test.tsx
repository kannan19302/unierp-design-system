import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { axe } from "vitest-axe";
import { DescriptionList, KeyValueList, descriptionListVariants } from "./description-list";

describe("DescriptionList Component", () => {
  it("forwards ref to dl element", () => {
    const ref = createRef<HTMLDListElement>();
    render(
      <DescriptionList
        ref={ref}
        items={[{ label: "Account Code", value: "1010-CASH" }]}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDListElement);
    expect(ref.current).toHaveAttribute("data-slot", "description-list");
  });

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

  it("renders data-slot annotations on anatomy", () => {
    const { container } = render(
      <DescriptionList
        items={[{ label: "Tax ID", value: "US-1234" }]}
      />
    );
    expect(container.querySelector('[data-slot="description-list"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="description-list-row"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="description-list-label"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="description-list-value"]')).toBeInTheDocument();
  });

  it("supports strict 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <DescriptionList
          density={density}
          items={[{ label: "Status", value: "Active" }]}
        />
      );
      const dl = container.querySelector('[data-slot="description-list"]');
      expect(dl).toHaveAttribute("data-density", density);
    });
  });

  it("aliases KeyValueList to DescriptionList", () => {
    expect(KeyValueList).toBe(DescriptionList);
    const classes = descriptionListVariants({ density: "ultra-compact", columns: 2 });
    expect(classes).toContain("densityUltraCompact");
    expect(classes).toContain("cols_2");
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
