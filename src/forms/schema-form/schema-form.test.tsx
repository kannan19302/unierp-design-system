import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { SchemaForm, type FormSectionSchema } from "../schema-form";

const testSections: FormSectionSchema[] = [
  {
    id: "general",
    title: "General Information",
    description: "Primary details for this account",
    fields: [
      {
        name: "companyName",
        label: "Company Name",
        type: "text",
        required: true,
        placeholder: "Enter company name",
      },
      {
        name: "fiscalYearEnd",
        label: "Fiscal Year End",
        type: "date",
        required: true,
      },
      {
        name: "accountType",
        label: "Account Type",
        type: "select",
        options: [
          { label: "Standard", value: "standard" },
          { label: "Enterprise", value: "enterprise" },
        ],
      },
      {
        name: "enterpriseTier",
        label: "Enterprise Tier",
        type: "text",
        showIf: (vals) => vals.accountType === "enterprise",
      },
      {
        name: "budget",
        label: "Budget",
        type: "currency",
        defaultValue: 5000,
      },
      {
        name: "activeSubscription",
        label: "Active Subscription",
        type: "switch",
        defaultValue: true,
      },
    ],
  },
];

describe("SchemaForm", () => {
  it("renders form sections and visible fields with accessible labels", () => {
    render(<SchemaForm sections={testSections} onSubmit={vi.fn()} />);

    expect(screen.getByText("General Information")).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fiscal Year End/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Account Type/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Budget/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Active Subscription/)).toBeInTheDocument();
    // Conditional field should not be visible initially
    expect(screen.queryByLabelText(/Enterprise Tier/)).not.toBeInTheDocument();
  });

  it("dynamically shows conditional fields when condition is met", async () => {
    render(<SchemaForm sections={testSections} onSubmit={vi.fn()} />);

    const select = screen.getByLabelText(/Account Type/);
    await userEvent.selectOptions(select, "enterprise");

    expect(screen.getByLabelText(/Enterprise Tier/)).toBeInTheDocument();
  });

  it("blocks submission and shows error summary when required fields are missing", async () => {
    const onSubmit = vi.fn();
    render(<SchemaForm sections={testSections} onSubmit={onSubmit} />);

    const submitBtn = screen.getByRole("button", { name: "Save Changes" });
    await userEvent.click(submitBtn);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getAllByText("Company Name is required")[0]).toBeInTheDocument();
  });

  it("submits valid values successfully", async () => {
    const onSubmit = vi.fn();
    render(<SchemaForm sections={testSections} onSubmit={onSubmit} />);

    const nameInput = screen.getByLabelText(/Company Name/);
    await userEvent.type(nameInput, "Acme Corp");

    const dateInput = screen.getByLabelText(/Fiscal Year End/);
    fireEvent.change(dateInput, { target: { value: "2026-12-31" } });

    const submitBtn = screen.getByRole("button", { name: "Save Changes" });
    await userEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        companyName: "Acme Corp",
        fiscalYearEnd: "2026-12-31",
        budget: 5000,
        activeSubscription: true,
      }),
    );
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<SchemaForm sections={testSections} onSubmit={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("keeps labels and section controls unique across form instances", () => {
    const { container } = render(<><SchemaForm sections={testSections} onSubmit={vi.fn()} /><SchemaForm sections={testSections} onSubmit={vi.fn()} /></>);
    const ids = Array.from(container.querySelectorAll("[id]"), (element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(screen.getAllByRole("textbox", { name: /Company Name/ })).toHaveLength(2);
    expect(screen.getAllByLabelText(/Fiscal Year End/)).toHaveLength(2);
    expect(screen.getAllByRole("spinbutton", { name: "Budget" })).toHaveLength(2);
  });

  it("exposes a keyboard operable section toggle and reveals invalid fields", async () => {
    const sections = [{ ...testSections[0], collapsible: true, defaultCollapsed: true }];
    render(<SchemaForm sections={sections} onSubmit={vi.fn()} />);
    const toggle = screen.getByRole("button", { name: "General Information" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(toggle.getAttribute("aria-controls")!)).toHaveAttribute("hidden");
    toggle.focus();
    await userEvent.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Enter}");
    await userEvent.click(screen.getByRole("button", { name: "Save Changes" }));
    await waitFor(() => expect(toggle).toHaveAttribute("aria-expanded", "true"));
    await waitFor(() => expect(screen.getByRole("textbox", { name: /Company Name/ })).toHaveFocus());
    await userEvent.click(screen.getByRole("button", { name: "Company Name is required" }));
    expect(screen.getByRole("textbox", { name: /Company Name/ })).toHaveFocus();
  });
});
