import type { Meta, StoryObj } from "@storybook/react";
import { DesktopTitlebar } from "./desktop-titlebar";

const meta: Meta<typeof DesktopTitlebar> = {
  title: "Platforms/Desktop/DesktopTitlebar/DesktopTitlebar",
  component: DesktopTitlebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DesktopTitlebar>;

export const Default: Story = {
  args: {
    title: "UniERP Desktop Shell",
    tenantName: "Acme Industrial Logistics",
    isMaximized: false,
  },
};
