import type { Meta, StoryObj } from '@storybook/react';
import { HeaderOnboardingHUD } from './header-onboarding-hud';

const meta: Meta<typeof HeaderOnboardingHUD> = {
  title: 'Platforms/BusinessSuite/Shared/HeaderOnboardingHud',
  component: HeaderOnboardingHUD,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HeaderOnboardingHUD>;

export const PartialProgress: Story = {
  args: {
    items: [
      { key: 'profile', label: 'Company Profile', isCompleted: true },
      { key: 'logo', label: 'Upload Organization Logo', isCompleted: true },
      { key: 'team', label: 'Invite Team Members', isCompleted: false, actionLabel: 'Invite' },
      { key: 'chart', label: 'Configure Chart of Accounts', isCompleted: false, actionLabel: 'Setup' },
    ],
  },
};

export const Complete: Story = {
  args: {
    items: [
      { key: 'profile', label: 'Company Profile', isCompleted: true },
      { key: 'logo', label: 'Upload Organization Logo', isCompleted: true },
    ],
  },
};
