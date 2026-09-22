import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import React from 'react';
import { DeveloperNav } from './developer-nav';

describe('DeveloperNav', () => {
  const mockItems = [
    { key: 'home', href: '/', label: 'Overview' },
    { key: 'apps', href: '/apps', label: 'Applications' },
    { key: 'sites', href: '/sites', label: 'Sites' },
  ];

  it('renders all navigation items', () => {
    render(<DeveloperNav items={mockItems} currentPath="/apps" />);
    expect(screen.getByText('Overview')).toBeDefined();
    expect(screen.getByText('Applications')).toBeDefined();
    expect(screen.getByText('Sites')).toBeDefined();
  });

  it('marks the active item with aria-current="page"', () => {
    render(<DeveloperNav items={mockItems} currentPath="/apps" />);
    const activeItem = screen.getByText('Applications').closest('a');
    expect(activeItem?.getAttribute('aria-current')).toBe('page');

    const inactiveItem = screen.getByText('Sites').closest('a');
    expect(inactiveItem?.getAttribute('aria-current')).toBeNull();
  });

  it('triggers onNavigate when clicked', () => {
    const handleNavigate = vi.fn();
    render(<DeveloperNav items={mockItems} currentPath="/apps" onNavigate={handleNavigate} />);
    fireEvent.click(screen.getByText('Sites'));
    expect(handleNavigate).toHaveBeenCalledWith('/sites');
  });

  it('satisfies WCAG 2.2 accessibility rules with vitest-axe', async () => {
    const { container } = render(<DeveloperNav items={mockItems} currentPath="/apps" />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
