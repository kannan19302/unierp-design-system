import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { TabContextMenu } from './tab-context-menu';

describe('TabContextMenu', () => {
  const defaultTarget = {
    type: 'tab' as const,
    tabId: 'ledger-tab',
    tabTitle: 'General Ledger',
    tabHref: '/finance/ledger',
    pinned: false,
    closable: true,
    index: 0,
    totalTabs: 2,
  };

  it('renders tab menu and passes a11y audit without violations', async () => {
    const { container, getByText } = render(
      <TabContextMenu
        target={defaultTarget}
        position={{ x: 50, y: 50 }}
        onClose={vi.fn()}
        onCloseTab={vi.fn()}
      />
    );

    expect(getByText('General Ledger')).toBeInTheDocument();
    expect(getByText('Close Tab')).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('invokes onCloseTab when close tab is clicked', () => {
    const onCloseTab = vi.fn();
    const onClose = vi.fn();

    const { getByText } = render(
      <TabContextMenu
        target={defaultTarget}
        position={{ x: 50, y: 50 }}
        onClose={onClose}
        onCloseTab={onCloseTab}
      />
    );

    fireEvent.click(getByText('Close Tab'));
    expect(onCloseTab).toHaveBeenCalledWith('ledger-tab');
    expect(onClose).toHaveBeenCalled();
  });

  it('renders tabstrip actions when target is tabstrip', () => {
    const onNewTab = vi.fn();
    const { getByText } = render(
      <TabContextMenu
        target={{ type: 'tabstrip', canReopen: false }}
        position={{ x: 50, y: 50 }}
        onClose={vi.fn()}
        onNewTab={onNewTab}
      />
    );

    fireEvent.click(getByText('New Tab'));
    expect(onNewTab).toHaveBeenCalled();
  });
});
