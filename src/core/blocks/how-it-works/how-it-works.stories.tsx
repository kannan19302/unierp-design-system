import type { Meta, StoryObj } from "@storybook/react";
import { HowItWorksBlock } from "./how-it-works";

const meta: Meta<typeof HowItWorksBlock> = {
  title: "Blocks/HowItWorksBlock",
  component: HowItWorksBlock,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof HowItWorksBlock>;

export const Default: Story = {
  args: {
    title: "Deploying UniERP Polyrepo",
    steps: [
      {
        title: "Clone Monorepo & Workspaces",
        description: "Initialize all 31 delivery units with pnpm workspace protocols.",
      },
      {
        title: "Run Design Language Alignment",
        description: "Enforce uniform component anatomy and zero CSS regressions.",
      },
      {
        title: "Deploy Tenant Apps",
        description: "Spin up isolated multi-tenant clusters with declarative schemas.",
      },
    ],
  },
};
