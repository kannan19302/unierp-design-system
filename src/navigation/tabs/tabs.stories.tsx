import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./tabs";
import { FileText, Shield, Activity } from "lucide-react";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["underline", "pills"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Underline: Story = {
  args: {
    value: "gl",
    variant: "underline",
    tabs: [
      { key: "gl", label: "General Ledger", icon: <FileText size={14} />, badge: "12" },
      { key: "audit", label: "Audit Trail", icon: <Shield size={14} /> },
      { key: "perf", label: "Performance", icon: <Activity size={14} /> },
    ],
  },
};

export const Pills: Story = {
  args: {
    value: "day",
    variant: "pills",
    tabs: [
      { key: "day", label: "Day" },
      { key: "week", label: "Week" },
      { key: "month", label: "Month" },
      { key: "year", label: "Year" },
    ],
  },
};
