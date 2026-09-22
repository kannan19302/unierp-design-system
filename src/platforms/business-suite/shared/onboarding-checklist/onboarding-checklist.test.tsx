import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { OnboardingChecklist } from './onboarding-checklist';

describe('OnboardingChecklist', () => {
  const items = [
    { key: 'item-1', title: 'Task One', description: 'Description 1', isCompleted: true },
    { key: 'item-2', title: 'Task Two', description: 'Description 2', isCompleted: false, actionLabel: 'Begin' },
  ];

  it('renders progress bar, titles, and passes a11y checks', async () => {
    const { container, getByText, getByRole } = render(
      <OnboardingChecklist items={items} />
    );

    expect(getByText('Get Started with UniERP')).toBeInTheDocument();
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('handles item action callback', () => {
    const onItemAction = vi.fn();
    const { getByText } = render(
      <OnboardingChecklist items={items} onItemAction={onItemAction} />
    );

    fireEvent.click(getByText('Begin'));
    expect(onItemAction).toHaveBeenCalledWith(items[1]);
  });
});
