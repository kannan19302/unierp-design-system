import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { AnnouncementCard } from "./announcement-card";

const defaultProps = {} as any;

describe("AnnouncementCard", () => {
  it("renders without crashing", () => {
    render(<AnnouncementCard {...defaultProps} title="🎉 New Feature: AI Copilot" body="Our new AI assistant can help you draft invoices, analyze spending patterns, and automate repetitive tasks." ctaLabel="Try It Now" variant="feature" onCtaClick={() => {}} onDismiss={() => {}} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<AnnouncementCard {...defaultProps} title="🎉 New Feature: AI Copilot" body="Our new AI assistant can help you draft invoices, analyze spending patterns, and automate repetitive tasks." ctaLabel="Try It Now" variant="feature" onCtaClick={() => {}} onDismiss={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
