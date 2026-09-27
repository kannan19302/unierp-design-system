import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Timeline } from "./timeline";

describe("Timeline Primitive", () => {
  it("renders timeline events and descriptions", () => {
    render(
      <Timeline
        items={[
          { id: "1", title: "Order Placed", timestamp: "10:00 AM", description: "By user" },
          { id: "2", title: "Payment Received", timestamp: "10:05 AM" },
        ]}
      />
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("Order Placed")).toBeInTheDocument();
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    expect(screen.getByText("By user")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <Timeline
        items={[{ id: "1", title: "Started", timestamp: "Now" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Timeline
        ref={ref}
        items={[{ id: "1", title: "Started", timestamp: "Now" }]}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("supports 4-tier density scaling", () => {
    const items = [{ id: "1", title: "Audit Log", timestamp: "12:00" }];
    const { container, rerender } = render(<Timeline items={items} density="ultra-compact" />);
    const root = container.querySelector('[data-slot="timeline"]');
    expect(root).toHaveAttribute("data-density", "ultra-compact");

    rerender(<Timeline items={items} density="compact" />);
    expect(root).toHaveAttribute("data-density", "compact");

    rerender(<Timeline items={items} density="standard" />);
    expect(root).toHaveAttribute("data-density", "standard");

    rerender(<Timeline items={items} density="comfortable" />);
    expect(root).toHaveAttribute("data-density", "comfortable");
  });

  it("renders data-slot annotations on timeline sub-elements", () => {
    const { container } = render(
      <Timeline
        items={[
          { id: "1", title: "Created", timestamp: "09:00", description: "Initial creation" },
          { id: "2", title: "Approved", timestamp: "10:00" },
        ]}
      />
    );
    expect(container.querySelector('[data-slot="timeline"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="timeline-item"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="timeline-node"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="timeline-dot"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="timeline-line"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="timeline-content"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="timeline-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="timeline-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="timeline-timestamp"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="timeline-description"]')).toBeInTheDocument();
  });
});

