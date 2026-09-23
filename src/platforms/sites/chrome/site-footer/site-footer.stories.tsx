import type { Meta, StoryObj } from "@storybook/react";
import { SiteFooter } from "./site-footer";

const meta: Meta<typeof SiteFooter> = {
  title: "Platforms/Sites/Chrome/SiteFooter",
  component: SiteFooter,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SiteFooter>;

export const Default: Story = {
  args: {
    copyrightText: "© 2026 UniERP Corporation.",
  },
};
