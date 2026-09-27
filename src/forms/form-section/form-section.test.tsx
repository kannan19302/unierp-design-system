import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { FormLayoutBuilder, FormSection } from "./form-section";

const MOCK_SECTIONS = [
  {
    id: "s1",
    label: "Contact Info",
    columns: 2,
    fields: ["First Name", "Last Name", "Email", "Phone"],
  },
  {
    id: "s2",
    label: "Address",
    columns: 3,
    fields: ["Street", "City", "State", "ZIP", "Country"],
  },
  {
    id: "s3",
    label: "Notes",
    columns: 1,
    fields: ["Internal Notes"],
  },
];

describe("FormLayoutBuilder & FormSection", () => {
  it("renders sections and field items correctly", () => {
    render(<FormLayoutBuilder sections={MOCK_SECTIONS} />);
    expect(screen.getByRole("region", { name: "Form layout builder" })).toBeInTheDocument();
    expect(screen.getByText("Form Layout Builder")).toBeInTheDocument();
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Street")).toBeInTheDocument();
  });

  it("forwards ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<FormLayoutBuilder ref={ref} sections={MOCK_SECTIONS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "region");
  });

  it("renders with data-slot attributes", () => {
    const { container } = render(<FormLayoutBuilder sections={MOCK_SECTIONS} />);
    expect(container.querySelector('[data-slot="form-section"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="form-section-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="form-section-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="form-section-content"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="form-section-item"]').length).toBe(3);
    expect(container.querySelectorAll('[data-slot="form-section-item-title"]').length).toBe(3);
    expect(container.querySelectorAll('[data-slot="form-section-grid"]').length).toBe(3);
    expect(container.querySelectorAll('[data-slot="form-section-field"]').length).toBe(10);
  });

  it("supports 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container, unmount } = render(
        <FormLayoutBuilder density={density} sections={MOCK_SECTIONS} />
      );
      const root = container.querySelector('[data-slot="form-section"]');
      expect(root).toHaveAttribute("data-density", density);
      unmount();
    });
  });

  it("works identically with FormSection alias", () => {
    render(<FormSection sections={MOCK_SECTIONS} />);
    expect(screen.getByRole("region", { name: "Form layout builder" })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FormLayoutBuilder sections={MOCK_SECTIONS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
