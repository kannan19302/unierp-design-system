import type { Meta, StoryObj } from "@storybook/react";
import { FeaturesGridBlock } from "./features-grid";

const meta: Meta<typeof FeaturesGridBlock> = {
  title: "Blocks/FeaturesGridBlock",
  component: FeaturesGridBlock,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof FeaturesGridBlock>;

export const Default: Story = {
  args: {
    title: "Engineered for Global Enterprise",
    subtitle: "Unified data pipeline, automated financial consolidations, and granular auditability.",
  },
};
