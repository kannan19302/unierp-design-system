import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  TextField,
  Input,
  Select,
  Textarea,
  FormField,
  FormSection,
  AutosaveIndicator,
} from "./form-control";

describe("Strata V1 FormControl Primitive", () => {
  it("renders label and input with linked id", () => {
    render(<TextField label="Email Address" placeholder="test@unierp.com" />);
    const input = screen.getByPlaceholderText("test@unierp.com");
    const label = screen.getByText("Email Address");
    expect(input).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  it("shows error alert message and sets aria-invalid", () => {
    render(<TextField label="Invoice ID" error="Invoice ID is invalid" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Invoice ID is invalid");
    const input = screen.getByLabelText("Invoice ID");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("renders input slots correctly", () => {
    render(
      <FormField label="Search" htmlFor="search-input">
        <Input
          id="search-input"
          placeholder="Search..."
          prefixIcon={<span data-testid="prefix-icon">🔍</span>}
          suffixIcon={<span data-testid="suffix-icon">ESC</span>}
        />
      </FormField>
    );
    expect(screen.getByTestId("prefix-icon")).toBeInTheDocument();
    expect(screen.getByTestId("suffix-icon")).toBeInTheDocument();
  });

  it("toggles collapsible FormSection", () => {
    render(
      <FormSection title="Advanced Config" collapsible defaultOpen={false}>
        <div>Hidden Content</div>
      </FormSection>
    );
    expect(screen.queryByText("Hidden Content")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Advanced Config"));
    expect(screen.getByText("Hidden Content")).toBeInTheDocument();
  });

  it("renders AutosaveIndicator with live region", () => {
    const { rerender } = render(<AutosaveIndicator status="saving" />);
    expect(screen.getByText("Saving changes...")).toHaveAttribute("aria-live", "polite");

    rerender(<AutosaveIndicator status="saved" />);
    expect(screen.getByText("All changes saved")).toBeInTheDocument();

    rerender(<AutosaveIndicator status="idle" />);
    expect(screen.queryByText("All changes saved")).not.toBeInTheDocument();
  });

  it("has zero accessibility violations across multiple form variants", async () => {
    const { container, rerender } = render(
      <FormField label="Full Name" htmlFor="name-input" hint="Legal name">
        <Input id="name-input" placeholder="John Doe" />
      </FormField>
    );
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    // Select variant
    rerender(
      <FormField label="Region" htmlFor="region-select">
        <Select id="region-select">
          <option value="us">United States</option>
          <option value="eu">Europe</option>
        </Select>
      </FormField>
    );
    results = await axe(container);
    expect(results).toHaveNoViolations();

    // Textarea variant with error
    rerender(
      <FormField label="Notes" htmlFor="notes-area" error="Notes required">
        <Textarea id="notes-area" />
      </FormField>
    );
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
