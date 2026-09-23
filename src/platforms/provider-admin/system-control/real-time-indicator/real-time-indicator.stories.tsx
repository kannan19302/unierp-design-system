import type { Meta, StoryObj } from '@storybook/react';
import { RealTimeIndicator } from './real-time-indicator';

const meta: Meta<typeof RealTimeIndicator> = {
  title: "Platforms/ProviderAdmin/SystemControl/RealTimeIndicator",
  component: RealTimeIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RealTimeIndicator>;

export const Connected: Story = {
  args: {
    status: 'connected',
    namespace: 'platform.telemetry',
    lastEventTime: new Date(),
  },
};

export const Connecting: Story = {
  args: {
    status: 'connecting',
    namespace: 'platform.telemetry',
  },
};

export const Disconnected: Story = {
  args: {
    status: 'disconnected',
    namespace: 'platform.telemetry',
    lastEventTime: '10:45:02 AM',
  },
};
