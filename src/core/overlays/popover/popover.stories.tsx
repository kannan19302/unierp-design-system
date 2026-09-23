import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "./popover";
import { Button } from "../../primitives/button";

const meta: Meta<typeof Popover> = {
  title: "Core/Overlays/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      element: "#storybook-root",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  argTypes: {
    align: {
      control: "select",
      options: ["left", "center", "right"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    trigger: <Button variant="secondary">Filter Ledger</Button>,
    children: (
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)" }}>Quick Filters</h4>
        <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          Toggle active fiscal periods and voucher types.
        </p>
      </div>
    ),
  },
};

export const AnatomyAndComposition: Story = {
  name: "Anatomy & Composition",
  args: {
    ...Default.args,
  },
};

export const AllStatesGallery: Story = {
  name: "All States Gallery",
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-6)", padding: "var(--space-8)" }}>
      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>Default Left-Aligned Popover</h4>
        <Popover
          trigger={<Button variant="outline">Ledger Info ℹ️</Button>}
        >
          <div style={{ padding: "var(--space-2)" }}>
            <strong>GL Account 1010</strong>
            <p style={{ fontSize: "var(--text-xs)", margin: "var(--space-1) 0 0", color: "var(--color-text-secondary)" }}>
              Operating Checking Account (Primary Cash).
            </p>
          </div>
        </Popover>
      </div>

      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>Right-Aligned Popover</h4>
        <Popover
          align="right"
          trigger={<Button variant="outline">Settings ⚙️</Button>}
        >
          <div style={{ padding: "var(--space-2)" }}>
            <strong>Display Density</strong>
            <p style={{ fontSize: "var(--text-xs)", margin: "var(--space-1) 0 0", color: "var(--color-text-secondary)" }}>
              Switch between compact and comfortable grid spacing.
            </p>
          </div>
        </Popover>
      </div>
    </div>
  ),
};

