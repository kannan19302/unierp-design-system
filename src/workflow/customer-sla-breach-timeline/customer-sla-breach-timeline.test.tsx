import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { CustomerSlaBreachTimeline } from "./customer-sla-breach-timeline";

describe("CustomerSlaBreachTimeline", () => {
  it("renders with zero axe accessibility violations", async () => {
    const { container } = render(<CustomerSlaBreachTimeline />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders customer account tier and SLA incidents", () => {
    render(
      <CustomerSlaBreachTimeline
        accountName="Goldman Sachs Trading Infrastructure"
        tier="Tier 1 Mission-Critical"
      />
    );
    expect(screen.getByText("Goldman Sachs Trading Infrastructure")).toBeInTheDocument();
    expect(screen.getByText("Tier 1 Mission-Critical")).toBeInTheDocument();
    expect(screen.getByText("INC-9901")).toBeInTheDocument();
    expect(screen.getByText("Global Transaction Gateway 504 Gateway Timeouts")).toBeInTheDocument();
    expect(screen.getByText("Total SLA Service Credits")).toBeInTheDocument();
  });

  it("handles escalating SLA breach to executive tier", () => {
    const onEscalate = vi.fn();
    render(<CustomerSlaBreachTimeline onEscalateTicket={onEscalate} />);

    const escalateButtons = screen.getAllByRole("button", { name: /Escalate SLA breach/i });
    expect(escalateButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(escalateButtons[0]);

    expect(onEscalate).toHaveBeenCalledWith("INC-9901");
    expect(screen.getByText("Executive Escalated")).toBeInTheDocument();
  });
});
