import type { Meta, StoryObj } from "@storybook/react";
import { TabbedConsole } from "./tabbed-console";

const meta: Meta<typeof TabbedConsole> = {
  title: "Shell/TabbedConsole",
  component: TabbedConsole,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TabbedConsole>;

export const Default: Story = {
  args: {
    tabs: [
      { id: "inv-1", title: "Invoice INV-2041", isDirty: true, content: <div style={{ padding: 24 }}>Invoice Form (Unsaved Changes)</div> },
      { id: "po-2", title: "PO-9942", content: <div style={{ padding: 24 }}>Purchase Order Details</div> },
      { id: "vendor-3", title: "Vendor: Acme Global", content: <div style={{ padding: 24 }}>Vendor Profile</div> },
    ],
  },
};
