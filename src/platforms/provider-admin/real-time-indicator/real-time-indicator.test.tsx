import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { RealTimeIndicator } from './real-time-indicator';

describe('RealTimeIndicator', () => {
  it('renders status and polite live region without a11y violations', async () => {
    const { container, getByText } = render(
      <RealTimeIndicator status="connected" namespace="telemetry" />
    );

    expect(getByText('Real-time active')).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders connecting state', () => {
    const { getByText } = render(
      <RealTimeIndicator status="connecting" namespace="telemetry" />
    );

    expect(getByText('Connecting...')).toBeInTheDocument();
  });

  it('renders disconnected state with timestamp', () => {
    const { getByText } = render(
      <RealTimeIndicator
        status="disconnected"
        namespace="telemetry"
        lastEventTime="12:00:00 PM"
      />
    );

    expect(getByText('Disconnected')).toBeInTheDocument();
    expect(getByText('(12:00:00 PM)')).toBeInTheDocument();
  });
});
