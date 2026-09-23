import type { Meta, StoryObj } from '@storybook/react';
import { KeyboardShortcutsHelp, DEFAULT_BUSINESS_SHORTCUTS } from './keyboard-shortcuts-help';

const meta: Meta<typeof KeyboardShortcutsHelp> = {
  title: 'Platforms/BusinessSuite/Shared/KeyboardShortcutsHelp',
  component: KeyboardShortcutsHelp,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KeyboardShortcutsHelp>;

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    shortcuts: DEFAULT_BUSINESS_SHORTCUTS,
  },
};
