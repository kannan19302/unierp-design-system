import type { Meta, StoryObj } from "@storybook/react";
import { SignaturePad } from "./signature-pad";

const meta: Meta<typeof SignaturePad> = {
  title: "Inputs/SignaturePad",
  component: SignaturePad,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SignaturePad>;

export const Default: Story = {
  args: {
    width: 360,
    height: 140,
  },
};
