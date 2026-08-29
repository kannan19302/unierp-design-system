import type { Meta, StoryObj } from "@storybook/react";
import { InfoHint } from "./info-hint";

const meta: Meta<typeof InfoHint> = {
  title: "COMPONENTS/InfoHint",
  component: InfoHint,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof InfoHint>;

export const Default: Story = {
  args: {
    text: "This field specifies the fiscal year end date.",
    size: 14,
  },
};

export const Large: Story = {
  args: {
    text: "Administrative permission required to modify tax rates.",
    size: 18,
  },
};
