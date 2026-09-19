import type { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "./drawer";
import { Button } from "../../primitives/button";

const meta: Meta<typeof Drawer> = {
  title: "Overlays/Drawer",
  component: Drawer,
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    open: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const RightInspector: Story = {
  args: {
    open: true,
    title: "Account Line Inspector",
    side: "right",
    size: "md",
    children: (
      <div>
        <p style={{ color: "var(--color-text-secondary)" }}>Displaying transaction audit breakdown and sub-ledger details.</p>
      </div>
    ),
    footer: (
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <Button variant="primary">Save Changes</Button>
      </div>
    ),
  },
};

export const LeftNavigation: Story = {
  args: {
    open: true,
    title: "Module Navigation",
    side: "left",
    size: "sm",
    children: <div>Navigation Links</div>,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ height: "450px", position: "relative" }}>
      <Drawer
        open={true}
        onClose={() => {}}
        title="Data Source Query Drawer"
        side="right"
        size="md"
        footer={
          <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end", width: "100%" }}>
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary">Apply Query</Button>
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            <strong>Drawer Anatomy:</strong> Backdrop mask, sliding panel (left/right/top/bottom), header with title &amp; close button, scrollable body, and action footer.
          </div>
          <div style={{ border: "1px solid var(--color-border)", padding: "var(--space-3)", borderRadius: "var(--radius-sm)", background: "var(--color-bg-sunken)" }}>
            Target Entity: <code>SalesOrderHeaders</code> (PostgreSQL RLS Active)
          </div>
        </div>
      </Drawer>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          1. Right Side Inspector Drawer
        </h4>
        <div style={{ height: "250px", position: "relative" }}>
          <Drawer
            open={true}
            onClose={() => {}}
            title="Field Properties"
            side="right"
            size="sm"
          >
            <div>Field schema details</div>
          </Drawer>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          2. Left Side Navigation Drawer
        </h4>
        <div style={{ height: "250px", position: "relative" }}>
          <Drawer
            open={true}
            onClose={() => {}}
            title="Quick Switcher"
            side="left"
            size="sm"
          >
            <div>Navigation items</div>
          </Drawer>
        </div>
      </div>
    </div>
  ),
};
