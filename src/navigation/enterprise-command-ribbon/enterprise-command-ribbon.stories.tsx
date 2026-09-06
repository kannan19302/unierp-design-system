import type { Meta, StoryObj } from "@storybook/react";
import { EnterpriseCommandRibbon } from "./enterprise-command-ribbon";

const meta: Meta<typeof EnterpriseCommandRibbon> = {
  title: "Navigation/EnterpriseCommandRibbon",
  component: EnterpriseCommandRibbon,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EnterpriseCommandRibbon>;

export const Default: Story = {
  args: {
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
  },
};

export const NavigateTabActive: Story = {
  args: {
    density: "compact",
    initialTabId: "tab_navigate",
  },
};
