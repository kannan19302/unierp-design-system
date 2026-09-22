import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./card";

const meta: Meta<typeof Card> = {
  title: "DataDisplay/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
    },
    hover: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    padding: "md",
    children: (
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0, fontSize: "var(--text-base)" }}>Ledger Reconciliation Card</h4>
        <p style={{ marginBlock: 0, marginInline: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Card container holding dense financial data structures.
        </p>
      </div>
    ),
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <Card padding="md">
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>Anatomy & Composition Card</h4>
        <p style={{ marginBlock: 0, marginInline: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Structured content container with standard surface elevation and typography.
        </p>
      </Card>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0 }}>Padding None</h5>
        <Card padding="none">
          <div style={{ paddingBlock: "var(--space-2)", paddingInline: "var(--space-2)" }}>Content without internal padding</div>
        </Card>
      </div>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0 }}>Padding Small</h5>
        <Card padding="sm">Small padding variant</Card>
      </div>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0 }}>Padding Medium with Hover</h5>
        <Card padding="md" hover>Hoverable interactive card</Card>
      </div>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0 }}>Padding Large</h5>
        <Card padding="lg">Large padding spacious layout</Card>
      </div>
    </div>
  ),
};
