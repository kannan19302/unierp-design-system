import type { Meta, StoryObj } from "@storybook/react";
import { AclPolicyVisualizer } from "./acl-policy-visualizer";

const meta: Meta<typeof AclPolicyVisualizer> = {
  title: "Inputs/AclPolicyVisualizer",
  component: AclPolicyVisualizer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AclPolicyVisualizer>;

export const DefaultPolicy: Story = {
  args: {
    policyName: "ZeroTrust-Tenant-Isolation-Enforcer",
  },
};
