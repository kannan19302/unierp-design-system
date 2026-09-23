import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { TenantModuleNav } from './tenant-module-nav';

describe('TenantModuleNav', () => {
  const tabs = [
    { id: 'tab1', label: 'Overview', href: '/overview' },
    { id: 'tab2', label: 'Security', href: '/security', badge: 3 },
  ];

  it('renders tab list and passes a11y audit', async () => {
    const { container, getByText } = render(
      <TenantModuleNav tabs={tabs} activeTabId="tab1" />
    );

    expect(getByText('Overview')).toBeInTheDocument();
    expect(getByText('Security')).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('handles tab click with onSelectTab', () => {
    const onSelectTab = vi.fn();
    const { getByText } = render(
      <TenantModuleNav tabs={tabs} activeTabId="tab1" onSelectTab={onSelectTab} />
    );

    fireEvent.click(getByText('Security'));
    expect(onSelectTab).toHaveBeenCalledWith(tabs[1]);
  });
});
