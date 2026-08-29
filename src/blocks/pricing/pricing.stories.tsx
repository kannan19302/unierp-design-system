import type { Meta, StoryObj } from "@storybook/react";
import { PricingBlock } from "./pricing";

const meta: Meta<typeof PricingBlock> = {
  title: "Blocks/PricingBlock",
  component: PricingBlock,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof PricingBlock>;

export const Default: Story = {
  args: {
    title: "Transparent Cloud ERP Pricing",
  },
};
