import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { AnimatedCounter } from './animated-counter';

describe('AnimatedCounter', () => {
  it('renders counter and passes a11y audit', async () => {
    const { container } = render(
      <AnimatedCounter value={5000} prefix="$" suffix=" ARR" durationMs={0} />
    );

    const span = container.querySelector('span');
    expect(span).toHaveAttribute('aria-label', '$5000 ARR');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
