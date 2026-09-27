import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Select } from "./select";

describe("Select", () => {
  it("renders with options and exposes data-slot", () => {
    const { container } = render(
      <Select
        label="Test Select"
        options={[{ label: "Option 1", value: "1" }]}
      />
    );
    expect(screen.getByLabelText("Test Select")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="select"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="select-input"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="select-label"]')).toBeInTheDocument();
  });

  it("renders error message and exposes data-slot", () => {
    const { container } = render(
      <Select
        label="Country"
        error="Selection required"
        options={[{ label: "USA", value: "us" }]}
      />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Selection required");
    expect(container.querySelector('[data-slot="select-error"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <Select
        label="Country"
        options={[{ label: "USA", value: "us" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
