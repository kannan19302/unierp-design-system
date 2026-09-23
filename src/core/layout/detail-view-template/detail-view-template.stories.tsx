import type { Meta, StoryObj } from "@storybook/react";
import { DetailViewTemplate } from "./detail-view-template";

const meta: Meta<typeof DetailViewTemplate> = {
  title: "Core/Layout/DetailViewTemplate",
  component: DetailViewTemplate,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DetailViewTemplate>;

export const Default: Story = {
  args: {
    entityType: "Customer Account",
    title: "Acme Industrial Logistics Inc.",
    identifier: "CUST-90214",
    mainContent: <div style={{ padding: "20px", background: "#fff", border: "1px solid #e2e8f0" }}>Main entity workspace content</div>,
    sidebarContent: <div style={{ padding: "20px", background: "#fff", border: "1px solid #e2e8f0" }}>Audit timeline and contacts</div>,
  },
};
