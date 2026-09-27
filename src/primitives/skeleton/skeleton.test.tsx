import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Skeleton, SkeletonText } from "./skeleton";

describe("Skeleton Primitive", () => {
  it("renders with aria-hidden true and data-slot", () => {
    const { container } = render(<Skeleton width={100} height={20} circle />);
    const el = container.querySelector("span");
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toHaveAttribute("data-slot", "skeleton");
    expect(el).toHaveAttribute("data-circle", "true");
  });

  it("renders correct number of lines in SkeletonText with data-slot", () => {
    const { container } = render(<SkeletonText lines={5} />);
    const containerSpan = container.querySelector('[data-slot="skeleton-text"]');
    expect(containerSpan).toBeInTheDocument();
    const spans = container.querySelectorAll('[data-slot="skeleton"]');
    expect(spans).toHaveLength(5);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <div>
        <Skeleton width={100} height={20} />
        <SkeletonText lines={3} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
