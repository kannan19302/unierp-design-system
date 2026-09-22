import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { DetailLayout } from "./detail-layout";

describe("DetailLayout Primitive", () => {
  it("renders header, main, and sidebar areas", () => {
    render(
      <DetailLayout
        header={<div>Header Area</div>}
        main={<div>Main Area</div>}
        sidebar={<div>Sidebar Area</div>}
      />
    );
    expect(screen.getByText("Header Area")).toBeInTheDocument();
    expect(screen.getByText("Main Area")).toBeInTheDocument();
    expect(screen.getByText("Sidebar Area")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DetailLayout
        header={<div>Header</div>}
        main={<div>Main</div>}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
