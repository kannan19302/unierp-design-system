import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { StrataAppGrid, DEFAULT_STRATA_APPS } from './strata-app-grid';

describe('StrataAppGrid', () => {
  it('renders app grid and passes a11y audit without violations', async () => {
    const { container, getByText } = render(<StrataAppGrid />);

    expect(getByText('Finance')).toBeInTheDocument();
    expect(getByText('Ledger & cash')).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders custom apps and supports custom link components', () => {
    const customApps = [
      { icon: 'B', name: 'Billing', description: 'Invoices & subscriptions', href: '/billing' },
    ];

    const CustomLink: React.FC<{ href: string; className?: string; children: React.ReactNode }> = ({
      href,
      className,
      children,
    }) => (
      <a href={href} className={`custom-link ${className}`}>
        {children}
      </a>
    );

    const { getByText, container } = render(
      <StrataAppGrid apps={customApps} linkComponent={CustomLink} />
    );

    expect(getByText('Billing')).toBeInTheDocument();
    expect(container.querySelector('.custom-link')).toBeInTheDocument();
  });
});
