import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  KitchenDisplayStationExpediter,
  KdsTicketOrder,
} from "./kitchen-display-station-expediter";

const sampleTickets: KdsTicketOrder[] = [
  {
    ticketId: "T-104",
    tableNumber: "Table 12",
    serverName: "Marco S.",
    elapsedMinutes: 16,
    orderType: "DINE_IN",
    status: "PREPARING",
    items: [
      {
        id: "item_01",
        name: "Prime Bone-In Ribeye 16oz",
        quantity: 2,
        modifiers: ["Medium Rare"],
        isCompleted: false,
      },
    ],
  },
];

describe("KitchenDisplayStationExpediter", () => {
  it("renders station header and active tickets truthfully", () => {
    render(
      <KitchenDisplayStationExpediter
        stationName="Station 2 - Grill & Hot Entrées"
        ticketOrders={sampleTickets}
      />
    );
    expect(screen.getByText("Station 2 - Grill & Hot Entrées")).toBeInTheDocument();
    expect(screen.getByText("#T-104")).toBeInTheDocument();
    expect(screen.getByText("Table 12")).toBeInTheDocument();
    expect(screen.getByText("Svr: Marco S.")).toBeInTheDocument();
    expect(screen.getByText("Prime Bone-In Ribeye 16oz")).toBeInTheDocument();
    expect(screen.getByText("• Medium Rare")).toBeInTheDocument();
  });

  it("handles ticking item completion and bumping ticket", () => {
    const handleBump = vi.fn();
    const handleToggle = vi.fn();

    render(
      <KitchenDisplayStationExpediter
        stationName="Station 2"
        ticketOrders={sampleTickets}
        onBumpTicket={handleBump}
        onToggleItemComplete={handleToggle}
      />
    );

    const checkBtn = screen.getByRole("button", {
      name: "Mark 2x Prime Bone-In Ribeye 16oz as completed",
    });
    fireEvent.click(checkBtn);
    expect(handleToggle).toHaveBeenCalledWith("T-104", "item_01");

    const bumpBtn = screen.getByRole("button", { name: "Bump order ticket T-104" });
    fireEvent.click(bumpBtn);
    expect(handleBump).toHaveBeenCalledWith("T-104");
    expect(screen.getByText(/All orders bumped/i)).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <KitchenDisplayStationExpediter
        stationName="Station 2"
        ticketOrders={sampleTickets}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
