import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { HeaderOnboardingHUD } from './header-onboarding-hud';

describe('HeaderOnboardingHUD', () => {
  const items = [
    { key: 'step1', label: 'Step One', isCompleted: true },
    { key: 'step2', label: 'Step Two', isCompleted: false, actionLabel: 'Configure' },
  ];

  it('renders progress HUD pill and passes a11y audit', async () => {
    const { container, getByText } = render(
      <HeaderOnboardingHUD items={items} />
    );

    expect(getByText('Setup Progress')).toBeInTheDocument();
    expect(getByText('50%')).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('opens drawer on click and shows items', async () => {
    const onItemAction = vi.fn();
    const { getByRole, getByText } = render(
      <HeaderOnboardingHUD items={items} onItemAction={onItemAction} />
    );

    const button = getByRole('button');
    fireEvent.click(button);

    expect(getByText('Workspace Setup')).toBeInTheDocument();
    expect(getByText('Step One')).toBeInTheDocument();

    const actionBtn = getByText('Configure');
    fireEvent.click(actionBtn);
    expect(onItemAction).toHaveBeenCalledWith(items[1]);
  });
});
