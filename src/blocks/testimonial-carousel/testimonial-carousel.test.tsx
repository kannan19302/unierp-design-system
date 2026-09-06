import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { TestimonialCarousel } from "./testimonial-carousel";

const defaultProps = {} as any;

describe("TestimonialCarousel", () => {
  it("renders without crashing", () => {
    render(<TestimonialCarousel {...defaultProps} testimonials={[{ quote: 'UniERP transformed how we manage our global operations. The real-time dashboards alone saved us 20 hours per week.', author: 'Sarah Chen', role: 'CFO', company: 'TechVentures Inc' }, { quote: 'The best enterprise platform we have ever used. Period.', author: 'Marcus Johnson', role: 'CTO', company: 'GlobalRetail Corp' }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<TestimonialCarousel {...defaultProps} testimonials={[{ quote: 'UniERP transformed how we manage our global operations. The real-time dashboards alone saved us 20 hours per week.', author: 'Sarah Chen', role: 'CFO', company: 'TechVentures Inc' }, { quote: 'The best enterprise platform we have ever used. Period.', author: 'Marcus Johnson', role: 'CTO', company: 'GlobalRetail Corp' }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
