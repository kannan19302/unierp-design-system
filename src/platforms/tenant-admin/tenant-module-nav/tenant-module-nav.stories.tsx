import type { Meta, StoryObj } from '@storybook/react';
import { TenantModuleNav } from './tenant-module-nav';

const meta: Meta<typeof TenantModuleNav> = {
  title: 'Platforms/TenantAdmin/TenantModuleNav',
  component: TenantModuleNav,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TenantModuleNav>;

export const Default: Story = {
  args: {
    tabs: [
      { id: 'general', label: 'General', href: '/settings/general' },
      { id: 'access-control', label: 'Access Control', href: '/settings/access-control', badge: 'New' },
      { id: 'billing', label: 'Billing & Subscriptions', href: '/settings/billing' },
      { id: 'security', label: 'Security & SSO', href: '/settings/security' },
      { id: 'audit-trail', label: 'Audit Trail', href: '/settings/audit-trail' },
    ],
    activeTabId: 'access-control',
  },
};
