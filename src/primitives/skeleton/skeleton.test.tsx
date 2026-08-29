import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Skeleton, SkeletonText } from "./skeleton";

describe("Skeleton Primitive", () => {
  it("renders with aria-hidden true", () => {
    const { container } = render(<Skeleton width={100} height={20} />);
    const el = container.querySelector("span");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("renders correct number of lines in SkeletonText", () => {
    const { container } = render(<SkeletonText lines={5} />);
    const spans = container.querySelectorAll("span > span");
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
