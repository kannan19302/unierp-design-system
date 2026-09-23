import type { Meta, StoryObj } from "@storybook/react";
import { ExtensionCard } from "./extension-card";

const meta: Meta<typeof ExtensionCard> = {
  title: "Platforms/Marketplace/ExtensionCard/ExtensionCard",
  component: ExtensionCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ExtensionCard>;

export const Default: Story = {
  args: {
    name: "Salesforce CRM Connector",
    publisher: "UniERP Integrations Labs",
    version: "3.4.0",
    description: "Bidirectional synchronization of Accounts, Opportunities, and Invoices with Salesforce Sales Cloud.",
    isVerified: true,
  },
};
