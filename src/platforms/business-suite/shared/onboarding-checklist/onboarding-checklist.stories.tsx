import type { Meta, StoryObj } from '@storybook/react';
import { OnboardingChecklist } from './onboarding-checklist';

const meta: Meta<typeof OnboardingChecklist> = {
  title: 'Platforms/BusinessSuite/Shared/OnboardingChecklist',
  component: OnboardingChecklist,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OnboardingChecklist>;

export const Default: Story = {
  args: {
    items: [
      { key: 'profile', title: 'Complete business profile', description: 'Enter legal company name, fiscal year, and address.', isCompleted: true },
      { key: 'logo', title: 'Upload brand logo', description: 'Upload SVG or high-res PNG for invoice branding.', isCompleted: true },
      { key: 'team', title: 'Invite team members', description: 'Grant role-based access for accountants and managers.', isCompleted: false, actionLabel: 'Invite' },
      { key: 'ledger', title: 'Connect primary bank feed', description: 'Sync transactions automatically with Plaid or Open Banking.', isCompleted: false, actionLabel: 'Connect' },
    ],
  },
};
