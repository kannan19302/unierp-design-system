import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { LogoCloud } from "./logo-cloud";

const defaultProps = {} as any;

describe("LogoCloud", () => {
  it("renders without crashing", () => {
    render(<LogoCloud {...defaultProps} logos={[{ name: 'Acme Corp', icon: '🏢' }, { name: 'TechVentures', icon: '🚀' }, { name: 'GlobalRetail', icon: '🛒' }, { name: 'FinanceFirst', icon: '💰' }, { name: 'HealthPlus', icon: '🏥' }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<LogoCloud {...defaultProps} logos={[{ name: 'Acme Corp', icon: '🏢' }, { name: 'TechVentures', icon: '🚀' }, { name: 'GlobalRetail', icon: '🛒' }, { name: 'FinanceFirst', icon: '💰' }, { name: 'HealthPlus', icon: '🏥' }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
