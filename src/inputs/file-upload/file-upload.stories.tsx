import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "./file-upload";

const meta: Meta<typeof FileUpload> = {
  title: "Inputs/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: {
    accept: ".csv,.xlsx,.pdf",
    multiple: true,
  },
};
