import type { Meta, StoryObj } from '@storybook/react';
import { BuilderSidebar, DEFAULT_BUILDER_GROUPS } from './builder-sidebar';

const meta: Meta<typeof BuilderSidebar> = {
  title: "Platforms/DeveloperPlatform/DevtoolsWorkbench/BuilderSidebar",
  component: BuilderSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BuilderSidebar>;

export const PaletteTab: Story = {
  args: {
    groups: DEFAULT_BUILDER_GROUPS,
    activeTab: 'palette',
  },
};

export const TreeTab: Story = {
  args: {
    groups: DEFAULT_BUILDER_GROUPS,
    activeTab: 'tree',
  },
};
