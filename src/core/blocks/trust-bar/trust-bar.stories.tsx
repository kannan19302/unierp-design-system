import type { Meta, StoryObj } from "@storybook/react";
import { TrustBarBlock } from "./trust-bar";

const meta: Meta<typeof TrustBarBlock> = {
  title: "Blocks/TrustBarBlock",
  component: TrustBarBlock,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof TrustBarBlock>;

export const Default: Story = {
  args: {
    title: "TRUSTED BY 2,000+ FAST-GROWING ENTERPRISES",
  },
};
