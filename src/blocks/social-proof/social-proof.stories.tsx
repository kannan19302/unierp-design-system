import type { Meta, StoryObj } from "@storybook/react";
import { SocialProofBlock } from "./social-proof";

const meta: Meta<typeof SocialProofBlock> = {
  title: "Blocks/SocialProofBlock",
  component: SocialProofBlock,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof SocialProofBlock>;

export const Default: Story = {
  args: {
    title: "Trusted by Modern Engineering Teams",
  },
};
