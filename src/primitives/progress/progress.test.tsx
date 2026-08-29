import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Progress } from "./progress";

describe("Progress Primitive", () => {
  it("renders progressbar with attributes", () => {
    render(<Progress value={40} max={100} label="Upload Progress" />);
    const bar = screen.getByRole("progressbar", { name: "Upload Progress" });
    expect(bar).toBeInTheDocument();
    expect(bar.getAttribute("aria-valuenow")).toBe("40");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<Progress value={75} max={100} label="Task" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
