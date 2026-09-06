import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { InboxNotificationStream } from "./inbox-notification-stream";

const defaultProps = {} as any;

describe("InboxNotificationStream", () => {
  it("renders without crashing", () => {
    render(<InboxNotificationStream {...defaultProps} items={[{ id: '1', title: 'New Invoice Approved', body: 'Invoice #INV-2026-0891 has been approved by John Smith.', timestamp: '2 min ago', read: false, icon: '✅' }, { id: '2', title: 'Deployment Complete', body: 'Production deployment v3.2.1 completed successfully.', timestamp: '15 min ago', read: false, icon: '🚀' }, { id: '3', title: 'Password Expiring', body: 'Your password will expire in 7 days.', timestamp: '1 hour ago', read: true, icon: '🔑' }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<InboxNotificationStream {...defaultProps} items={[{ id: '1', title: 'New Invoice Approved', body: 'Invoice #INV-2026-0891 has been approved by John Smith.', timestamp: '2 min ago', read: false, icon: '✅' }, { id: '2', title: 'Deployment Complete', body: 'Production deployment v3.2.1 completed successfully.', timestamp: '15 min ago', read: false, icon: '🚀' }, { id: '3', title: 'Password Expiring', body: 'Your password will expire in 7 days.', timestamp: '1 hour ago', read: true, icon: '🔑' }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
