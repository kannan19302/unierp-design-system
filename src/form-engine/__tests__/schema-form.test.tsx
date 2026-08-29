import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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
    ],
  },
];

describe("SchemaForm", () => {
  it("renders form sections and visible fields", () => {
    render(<SchemaForm sections={testSections} onSubmit={vi.fn()} />);

    expect(screen.getByText("General Information")).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Account Type/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Budget/)).toBeInTheDocument();
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

    const submitBtn = screen.getByRole("button", { name: "Save Changes" });
    await userEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        companyName: "Acme Corp",
        budget: 5000,
      }),
    );
  });
});
