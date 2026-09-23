import type { Meta, StoryObj } from '@storybook/react';
import { TabContextMenu } from './tab-context-menu';

const meta: Meta<typeof TabContextMenu> = {
  title: 'Platforms/BusinessSuite/Shared/TabContextMenu',
  component: TabContextMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TabContextMenu>;

export const TabTarget: Story = {
  args: {
    target: {
      type: 'tab',
      tabId: 'tab-1',
      tabTitle: 'General Ledger',
      tabHref: '/finance/ledger',
      pinned: false,
      closable: true,
      index: 1,
      totalTabs: 4,
    },
    position: { x: 100, y: 100 },
    onClose: () => {},
    onCloseTab: () => {},
    onReloadTab: () => {},
    onDuplicateTab: () => {},
    onTogglePinTab: () => {},
  },
};

export const TabStripTarget: Story = {
  args: {
    target: {
      type: 'tabstrip',
      canReopen: true,
      reopenTitle: 'Accounts Payable',
    },
    position: { x: 100, y: 100 },
    onClose: () => {},
    onNewTab: () => {},
    onReopenClosedTab: () => {},
  },
};
