import type { Meta, StoryObj } from "@storybook/react";
import { LookupFieldResolver } from "./lookup-field-resolver";

const meta: Meta<typeof LookupFieldResolver> = {
  title: "Core/Forms/LookupFieldResolver",
  component: LookupFieldResolver,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Asynchronous foreign-key entity lookup with search debouncing, type-ahead suggestions, and selected chip representation.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LookupFieldResolver>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <LookupFieldResolver
        label="Customer Account"
        placeholder="Search customers by name, tax ID, or account code..."
        results={[
          { id: "1", label: "Acme Corporation", subtitle: "ACC-001 • Enterprise Global" },
          { id: "2", label: "GlobalTech Inc", subtitle: "ACC-002 • Mid-Market Commercial" },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: 600 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          1. Active Lookup with Suggestions
        </h4>
        <LookupFieldResolver
          label="Customer Account"
          placeholder="Search customers..."
          results={[
            { id: "1", label: "Acme Corporation", subtitle: "ACC-001 • Enterprise Global" },
            { id: "2", label: "GlobalTech Inc", subtitle: "ACC-002 • Mid-Market Commercial" },
          ]}
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          2. Empty State
        </h4>
        <LookupFieldResolver
          label="Vendor Code"
          placeholder="Type at least 2 characters to search vendors..."
          results={[]}
        />
      </div>
    </div>
  ),
};
