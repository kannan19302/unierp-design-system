import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CommandPalette } from "./command-palette";
import { FilePlus, Settings, Users, BookOpen, Layers } from "lucide-react";

const meta: Meta<typeof CommandPalette> = {
  title: "Overlays/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

const sampleItems = [
  { id: "1", category: "Actions", title: "Create Journal Entry", subtitle: "Post debit and credit lines", icon: <FilePlus size={14} />, onSelect: () => console.log("Create JE") },
  { id: "2", category: "Navigation", title: "Chart of Accounts", subtitle: "Go to GL structure", icon: <BookOpen size={14} />, onSelect: () => console.log("COA") },
  { id: "3", category: "Administration", title: "Tenant Settings", subtitle: "Fiscal year and currencies", icon: <Settings size={14} />, onSelect: () => console.log("Settings") },
  { id: "4", category: "Security", title: "User Access Matrix", subtitle: "Manage RBAC roles", icon: <Users size={14} />, onSelect: () => console.log("Users") },
  { id: "5", category: "Data", title: "Export Schema DDL", subtitle: "PostgreSQL 16 dialect", icon: <Layers size={14} />, onSelect: () => console.log("DDL") },
];

export const Default: Story = {
  args: {
    open: true,
    size: "md",
    items: sampleItems,
  },
};

export const Small: Story = {
  args: {
    open: true,
    size: "sm",
    items: sampleItems.slice(0, 3),
  },
};

export const Large: Story = {
  args: {
    open: true,
    size: "lg",
    items: sampleItems,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div>
      <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Command Palette Active Modal</p>
      <CommandPalette
        open={true}
        onClose={() => {}}
        items={sampleItems}
        placeholder="Type a command or jump target..."
      />
    </div>
  ),
};
