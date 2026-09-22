import type { Meta, StoryObj } from '@storybook/react';
import { StrataAppGrid, DEFAULT_STRATA_APPS } from './strata-app-grid';

const meta: Meta<typeof StrataAppGrid> = {
  title: 'Platforms/BusinessSuite/StrataAppGrid',
  component: StrataAppGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StrataAppGrid>;

export const Default: Story = {
  args: {
    apps: DEFAULT_STRATA_APPS,
  },
};

export const CustomApps: Story = {
  args: {
    apps: [
      { icon: 'F', name: 'Finance', description: 'Ledger & cash', href: '/finance' },
      { icon: 'S', name: 'Supply Chain', description: 'Procurement & vendor portal', href: '/procurement' },
      { icon: 'H', name: 'Human Resources', description: 'Payroll & workforce', href: '/hr' },
    ],
  },
};
