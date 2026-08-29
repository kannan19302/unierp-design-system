import type { Meta, StoryObj } from "@storybook/react";
import { HeroBlock } from "./hero";

const meta: Meta<typeof HeroBlock> = {
  title: "Blocks/HeroBlock",
  component: HeroBlock,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof HeroBlock>;

export const Centered: Story = {
  args: {
    title: "Next-Generation Enterprise OS",
    subtitle: "Deliver unified ERP, headless finance, and polyrepo scalability in minutes.",
    primaryCta: "Get Started Free",
    secondaryCta: "View Documentation",
    alignment: "center",
  },
};
