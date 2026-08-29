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
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-base)" }}>Ledger Reconciliation Card</h4>
        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Card container holding dense financial data structures.
        </p>
      </div>
    ),
  },
};
