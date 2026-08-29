import type { Meta, StoryObj } from "@storybook/react";
import { RichTextEditor } from "./rich-text-editor";

const meta: Meta<typeof RichTextEditor> = {
  title: "Inputs/RichTextEditor",
  component: RichTextEditor,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

export const Default: Story = {
  args: {
    value: "### Terms and Conditions\n- All invoices must be cleared within 30 business days.\n- Interest of 1.5% applies to overdue balance.",
  },
};
