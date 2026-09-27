import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { InlineEditableRecord } from "./inline-editable-record";

const sampleFields = [
  { key: "name", label: "Company Name", value: "Acme Corp", editable: true },
  { key: "email", label: "Contact Email", value: "billing@acme.com", editable: true },
  { key: "plan", label: "Plan", value: "Enterprise", editable: true },
  { key: "id", label: "Account ID", value: "ACC-00472", editable: false },
];

describe("InlineEditableRecord", () => {
  it("renders fields and allows inline edit and save", () => {
    const onSave = vi.fn();
    render(<InlineEditableRecord fields={sampleFields} onSave={onSave} />);

    expect(screen.getByRole("form", { name: "Inline editable record" })).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();

    const editBtn = screen.getByRole("button", { name: "Edit Company Name" });
    fireEvent.click(editBtn);

    const input = screen.getByLabelText("Company Name");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "Acme Global" } });

    const saveBtn = screen.getByRole("button", { name: "Save Company Name" });
    fireEvent.click(saveBtn);

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Acme Global" })
    );
  });

  it("allows cancelling inline edit", () => {
    render(<InlineEditableRecord fields={sampleFields} />);
    const editBtn = screen.getByRole("button", { name: "Edit Company Name" });
    fireEvent.click(editBtn);

    const cancelBtn = screen.getByRole("button", { name: "Cancel editing Company Name" });
    fireEvent.click(cancelBtn);

    expect(screen.queryByLabelText("Company Name")).not.toBeInTheDocument();
  });

  it("forwards ref correctly to the container div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<InlineEditableRecord ref={ref} fields={sampleFields} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "form");
  });

  it("renders with data-slot attributes", () => {
    const { container } = render(<InlineEditableRecord fields={sampleFields} />);
    expect(container.querySelector('[data-slot="inline-editable-record"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="inline-editable-record-content"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="inline-editable-record-row"]').length).toBe(4);
    expect(container.querySelectorAll('[data-slot="inline-editable-record-label"]').length).toBe(4);
    expect(container.querySelectorAll('[data-slot="inline-editable-record-value"]').length).toBe(4);
    expect(container.querySelectorAll('[data-slot="inline-editable-record-edit-btn"]').length).toBe(3);
  });

  it("supports 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container, unmount } = render(
        <InlineEditableRecord density={density} fields={sampleFields} />
      );
      const root = container.querySelector('[data-slot="inline-editable-record"]');
      expect(root).toHaveAttribute("data-density", density);
      unmount();
    });
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<InlineEditableRecord fields={sampleFields} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
