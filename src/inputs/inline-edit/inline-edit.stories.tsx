import type { Meta, StoryObj } from "@storybook/react";
import { InlineEdit } from "./inline-edit";

const meta: Meta<typeof InlineEdit> = {
  title: "Inputs/InlineEdit",
  component: InlineEdit,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof InlineEdit>;

export const Default: Story = {
  args: {
    label: "Company Name",
    value: "Acme Industrial Corp",
    onSave: (val) => console.log("Saved:", val),
  },
};

export const Empty: Story = {
  args: {
    label: "Secondary Contact",
    value: "",
    placeholder: "Add contact...",
    onSave: (val) => console.log("Saved:", val),
  },
};

export const WithValidation: Story = {
  args: {
    label: "Quantity",
    value: "100",
    type: "number",
    validate: (val) => (Number(val) <= 0 ? "Quantity must be greater than zero" : null),
    onSave: (val) => console.log("Saved:", val),
  },
};

export const Disabled: Story = {
  args: {
    label: "Fiscal Year",
    value: "FY 2026-Q3",
    disabled: true,
    onSave: () => {},
  },
};
