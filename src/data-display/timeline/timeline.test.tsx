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
});
