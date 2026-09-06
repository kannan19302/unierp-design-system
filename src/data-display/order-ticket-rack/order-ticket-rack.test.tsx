import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { OrderTicketRack, OrderTicket } from "./order-ticket-rack";

const TEST_TICKETS: OrderTicket[] = [
  {
    id: "t1",
    orderNumber: "201",
    destination: "Dine-In",
    tableOrChannel: "Table 4",
    elapsedSeconds: 90,
    items: [
      { id: "item-1", name: "Avocado Toast", quantity: 2 },
      { id: "item-2", name: "Cold Brew", quantity: 1, isCompleted: true },
    ],
  },
  {
    id: "t2",
    orderNumber: "202",
    destination: "Delivery",
    elapsedSeconds: 700,
    items: [{ id: "item-3", name: "Breakfast Burrito", quantity: 1 }],
  },
];

describe("OrderTicketRack", () => {
  it("renders order tickets and has zero accessibility violations", async () => {
    const { container } = render(
      <OrderTicketRack
        title="Active Kitchen Queue"
        tickets={TEST_TICKETS}
      />
    );

    expect(screen.getByText("Active Kitchen Queue")).toBeInTheDocument();
    expect(screen.getByText("#201")).toBeInTheDocument();
    expect(screen.getByText("Avocado Toast")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("triggers onBumpTicket when bump button is clicked", () => {
    const handleBump = vi.fn();
    render(
      <OrderTicketRack
        tickets={TEST_TICKETS}
        onBumpTicket={handleBump}
      />
    );

    const bumpBtn = screen.getByRole("button", { name: /Bump order #201/i });
    fireEvent.click(bumpBtn);

    expect(handleBump).toHaveBeenCalledWith("t1");
  });

  it("toggles item completion when line item button is clicked", () => {
    const handleToggleItem = vi.fn();
    render(
      <OrderTicketRack
        tickets={TEST_TICKETS}
        onToggleItem={handleToggleItem}
      />
    );

    const itemBtn = screen.getByRole("button", { name: /2x Avocado Toast/i });
    fireEvent.click(itemBtn);

    expect(handleToggleItem).toHaveBeenCalledWith("t1", "item-1");
  });

  it("filters tickets by destination", () => {
    render(
      <OrderTicketRack
        tickets={TEST_TICKETS}
      />
    );

    const deliveryTab = screen.getByRole("button", { name: /^Delivery$/i });
    fireEvent.click(deliveryTab);

    expect(screen.getByText("#202")).toBeInTheDocument();
    expect(screen.queryByText("#201")).not.toBeInTheDocument();
  });
});
