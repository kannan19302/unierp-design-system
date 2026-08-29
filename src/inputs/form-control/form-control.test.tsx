import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { TextField, Input, Select, FormField } from "./form-control";

describe("FormControl Primitive", () => {
  it("renders label and input with linked id", () => {
    render(<TextField label="Email Address" placeholder="test@unierp.com" />);
    const input = screen.getByPlaceholderText("test@unierp.com");
    const label = screen.getByText("Email Address");
    expect(input).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  it("shows error alert message", () => {
    render(<TextField label="Invoice ID" error="Invoice ID is invalid" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Invoice ID is invalid");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <FormField label="Full Name" htmlFor="name-input" hint="Legal name">
        <Input id="name-input" placeholder="John Doe" />
      </FormField>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
