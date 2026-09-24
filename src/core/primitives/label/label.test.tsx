import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Label } from "./label";

describe("Label Primitive", () => {
  it("renders children text accurately", () => {
    render(<Label htmlFor="test-input">Username</Label>);
    const label = screen.getByText("Username");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "test-input");
  });

  it("renders required indicator when required is true", () => {
    render(<Label required>Password</Label>);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders optional indicator when optional is true", () => {
    render(<Label optional>Department</Label>);
    expect(screen.getByText("(optional)")).toBeInTheDocument();
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
