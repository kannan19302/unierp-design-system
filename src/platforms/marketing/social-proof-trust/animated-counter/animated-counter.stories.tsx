import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedCounter } from './animated-counter';

const meta: Meta<typeof AnimatedCounter> = {
  title: "Platforms/Marketing/SocialProofTrust/AnimatedCounter",
  component: AnimatedCounter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AnimatedCounter>;

export const Currency: Story = {
  args: {
    value: 1250000,
    prefix: '$',
    suffix: '',
    decimals: 0,
    durationMs: 1500,
  },
};

export const Percentage: Story = {
  args: {
    value: 99.99,
    prefix: '',
    suffix: '%',
    decimals: 2,
    durationMs: 1500,
  },
};
