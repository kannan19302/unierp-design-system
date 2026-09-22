import type { Meta, StoryObj } from "@storybook/react";
import { SiteHeader } from "./site-header";

const meta: Meta<typeof SiteHeader> = {
  title: "Platforms/Sites/SiteHeader",
  component: SiteHeader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SiteHeader>;

export const Default: Story = {
  args: {
    brandName: "UniERP Cloud",
  },
};
