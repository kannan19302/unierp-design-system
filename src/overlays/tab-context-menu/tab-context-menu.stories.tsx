import type { Meta, StoryObj } from "@storybook/react";
import { TabContextMenu } from "./tab-context-menu";

const meta: Meta<typeof TabContextMenu> = {
  title: "Overlays/TabContextMenu",
  component: TabContextMenu,
  args: {
    target: {
      type: "tab",
      tabId: "tab-gl",
      tabTitle: "General ledger",
      tabHref: "/finance/gl",
      pinned: false,
      closable: true,
      index: 1,
      totalTabs: 3,
    },
    position: { x: 24, y: 24 },
    onClose: () => undefined,
    onReloadTab: () => undefined,
    onDuplicateTab: () => undefined,
    onTogglePinTab: () => undefined,
    onMoveTab: () => undefined,
    onCloseTab: () => undefined,
    onCloseOtherTabs: () => undefined,
    onCloseTabsToLeft: () => undefined,
    onCloseTabsToRight: () => undefined,
    onCloseAllTabs: () => undefined,
    onReopenClosedTab: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof TabContextMenu>;

export const TabActions: Story = {};
export const TabStripActions: Story = {
  args: {
    target: { type: "tabstrip", canReopen: true, reopenTitle: "Accounts payable" },
  },
};
