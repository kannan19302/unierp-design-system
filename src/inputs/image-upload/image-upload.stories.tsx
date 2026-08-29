import type { Meta, StoryObj } from "@storybook/react";
import { ImageUpload } from "./image-upload";

const meta: Meta<typeof ImageUpload> = {
  title: "Inputs/ImageUpload",
  component: ImageUpload,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

export const Default: Story = {
  args: {},
};

export const WithPreview: Story = {
  args: {
    value: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
};
