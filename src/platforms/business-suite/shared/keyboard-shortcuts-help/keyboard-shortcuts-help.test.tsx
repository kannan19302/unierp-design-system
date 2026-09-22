import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { KeyboardShortcutsHelp, DEFAULT_BUSINESS_SHORTCUTS } from './keyboard-shortcuts-help';

describe('KeyboardShortcutsHelp', () => {
  it('renders modal dialog and passes a11y audit when open', async () => {
    const { container, getByRole, getByText } = render(
      <KeyboardShortcutsHelp isOpen={true} onClose={vi.fn()} />
    );

    expect(getByRole('dialog')).toBeInTheDocument();
    expect(getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(getByText('Open command palette')).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('does not render when closed', () => {
    const { queryByRole } = render(
      <KeyboardShortcutsHelp isOpen={false} onClose={vi.fn()} />
    );

    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked', () => {
    const onClose = vi.fn();
    const { getByLabelText } = render(
      <KeyboardShortcutsHelp isOpen={true} onClose={onClose} />
    );

    fireEvent.click(getByLabelText('Close shortcuts dialog'));
    expect(onClose).toHaveBeenCalled();
  });
});
