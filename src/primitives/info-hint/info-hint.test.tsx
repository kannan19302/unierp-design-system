import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { InfoHint } from "./info-hint";

describe("InfoHint Primitive", () => {
  it("renders accessible icon with label", () => {
    render(<InfoHint text="Helper information" />);
    expect(screen.getByRole("img", { name: "Helper information" })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<InfoHint text="Helper explanation" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
