import type { Meta, StoryObj } from "@storybook/react";
import { SplitMasterDetailTemplate } from "./split-master-detail-template";

const meta: Meta<typeof SplitMasterDetailTemplate> = {
  title: "Core/Layout/SplitMasterDetailTemplate",
  component: SplitMasterDetailTemplate,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SplitMasterDetailTemplate>;

export const Default: Story = {
  args: {
    masterTitle: "Suppliers (1,248)",
    masterList: <div>List items here...</div>,
    detailHeader: <h3>Supplier Detail View</h3>,
    detailBody: <div>Detailed supplier attributes and contracts...</div>,
  },
};
