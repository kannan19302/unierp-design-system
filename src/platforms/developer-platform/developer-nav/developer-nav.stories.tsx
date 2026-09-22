import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DeveloperNav } from './developer-nav';

const meta: Meta<typeof DeveloperNav> = {
  title: 'Platforms/DeveloperPlatform/DeveloperNav',
  component: DeveloperNav,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DeveloperNav>;

export const Default: Story = {
  args: {
    currentPath: '/apps',
    items: [
      { key: 'home', href: '/', label: 'Overview' },
      { key: 'apps', href: '/apps', label: 'Applications' },
      { key: 'sites', href: '/sites', label: 'Sites & Portals' },
      { key: 'library', href: '/library', label: 'Extension Library' },
      { key: 'manage', href: '/manage', label: 'Platform Management' },
    ],
  },
};
