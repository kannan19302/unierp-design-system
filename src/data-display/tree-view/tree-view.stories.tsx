import type { Meta, StoryObj } from "@storybook/react";
import { TreeView } from "./tree-view";

const meta: Meta<typeof TreeView> = {
  title: "DataDisplay/TreeView",
  component: TreeView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TreeView>;

export const ChartOfAccounts: Story = {
  args: {
    selectedId: "1010",
    nodes: [
      {
        id: "1000",
        label: "1000 - Assets",
        children: [
          {
            id: "1010",
            label: "1010 - Current Assets",
            children: [
              { id: "1011", label: "1011 - Cash and Equivalents" },
              { id: "1012", label: "1012 - Accounts Receivable" },
            ],
          },
          {
            id: "1020",
            label: "1020 - Fixed Assets",
            children: [{ id: "1021", label: "1021 - Computer Equipment" }],
          },
        ],
      },
      {
        id: "2000",
        label: "2000 - Liabilities",
        children: [{ id: "2010", label: "2010 - Accounts Payable" }],
      },
    ],
  },
};
