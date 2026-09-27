import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Label, labelVariants } from "./label";

describe("Label Primitive", () => {
  it("renders children text accurately with data-slot attributes", () => {
    render(<Label htmlFor="test-input">Username</Label>);
    const label = screen.getByText("Username");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "test-input");
    expect(label).toHaveAttribute("data-slot", "label");
    expect(label).toHaveAttribute("data-size", "md");
  });

  it("renders required indicator with data-slot when required is true", () => {
    render(<Label required>Password</Label>);
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='label-asterisk']")).toBeInTheDocument();
  });

  it("renders optional indicator when optional is true", () => {
    render(<Label optional>Department</Label>);
    expect(screen.getByText("(optional)")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='label-optional']")).toBeInTheDocument();
  });

  it("applies disabled and error states properly", () => {
    const { container } = render(
      <Label disabled error>
        Account Number
      </Label>
    );
    const label = container.querySelector("label");
    expect(label?.className).toContain("disabled");
    expect(label?.className).toContain("error");
    expect(label).toHaveAttribute("data-disabled", "true");
    expect(label).toHaveAttribute("data-error", "true");
  });

  it("generates correct classes via labelVariants cva helper", () => {
    const classes = labelVariants({ size: "lg", error: true });
    expect(classes).toContain("lg");
    expect(classes).toContain("error");
  });

  it("has zero accessibility violations when associated with form controls", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="usr" required>
          Username
        </Label>
        <input id="usr" type="text" />
        <Label htmlFor="dept" optional>
          Department
        </Label>
        <input id="dept" type="text" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
