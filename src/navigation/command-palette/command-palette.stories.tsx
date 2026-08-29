import type { Meta, StoryObj } from "@storybook/react";
import { CommandPalette } from "./command-palette";
import { FilePlus, Settings, Users, BookOpen } from "lucide-react";

const meta: Meta<typeof CommandPalette> = {
  title: "Navigation/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  args: {
    open: true,
    items: [
      { id: "1", category: "Actions", title: "Create Journal Entry", subtitle: "Post debit and credit lines", icon: <FilePlus size={14} />, onSelect: () => alert("Create JE") },
      { id: "2", category: "Navigation", title: "Chart of Accounts", subtitle: "Go to GL structure", icon: <BookOpen size={14} />, onSelect: () => alert("COA") },
      { id: "3", category: "Administration", title: "Tenant Settings", subtitle: "Fiscal year and currencies", icon: <Settings size={14} />, onSelect: () => alert("Settings") },
      { id: "4", category: "Security", title: "User Access Matrix", subtitle: "Manage RBAC roles", icon: <Users size={14} />, onSelect: () => alert("Users") },
    ],
  },
};
