import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Separator } from "./separator";

describe("Separator Primitive", () => {
  it("renders decorative separator with aria-hidden", () => {
    const { container } = render(<Separator orientation="horizontal" />);
    const div = container.querySelector("div");
    expect(div).toHaveAttribute("aria-hidden", "true");
    expect(div?.className).toContain("horizontal");
  });

  it("renders accessible separator with role and orientation", () => {
    const { container } = render(
      <Separator orientation="vertical" decorative={false} />
    );
    const div = container.querySelector("div");
    expect(div).toHaveAttribute("role", "separator");
    expect(div).toHaveAttribute("aria-orientation", "vertical");
    expect(div?.className).toContain("vertical");
  });

  it("has zero accessibility violations in decorative and semantic modes", async () => {
    const { container } = render(
      <div>
        <p>Section A</p>
        <Separator orientation="horizontal" />
        <p>Section B</p>
        <Separator orientation="horizontal" decorative={false} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
