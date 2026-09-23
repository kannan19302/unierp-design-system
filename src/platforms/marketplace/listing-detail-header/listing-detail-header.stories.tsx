import type { Meta, StoryObj } from "@storybook/react";
import { ListingDetailHeader } from "./listing-detail-header";

const meta: Meta<typeof ListingDetailHeader> = {
  title: "Platforms/Marketplace/ListingDetailHeader/ListingDetailHeader",
  component: ListingDetailHeader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ListingDetailHeader>;

export const Default: Story = {
  args: {
    name: "DocuSign Digital Signatures",
    publisher: "DocuSign Inc.",
    category: "Workflow & Legal",
    version: "2.1.4",
  },
};
