import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { BuilderSidebar, DEFAULT_BUILDER_GROUPS } from './builder-sidebar';

describe('BuilderSidebar', () => {
  it('renders components palette and passes a11y audit', async () => {
    const { container, getByText, getByPlaceholderText } = render(
      <BuilderSidebar groups={DEFAULT_BUILDER_GROUPS} />
    );

    expect(getByText('Components')).toBeInTheDocument();
    expect(getByPlaceholderText('Search components...')).toBeInTheDocument();
    expect(getByText('Short Text')).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('filters components on search input', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <BuilderSidebar groups={DEFAULT_BUILDER_GROUPS} />
    );

    const input = getByPlaceholderText('Search components...');
    fireEvent.change(input, { target: { value: 'Date' } });

    expect(getByText('Date Picker')).toBeInTheDocument();
    expect(queryByText('Short Text')).not.toBeInTheDocument();
  });

  it('triggers onSelectItem when component button is clicked', () => {
    const onSelectItem = vi.fn();
    const { getByText } = render(
      <BuilderSidebar groups={DEFAULT_BUILDER_GROUPS} onSelectItem={onSelectItem} />
    );

    fireEvent.click(getByText('Short Text'));
    expect(onSelectItem).toHaveBeenCalled();
  });
});
