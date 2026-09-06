import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import {
  RestaurantFloorplanTableMap,
  type DiningTableItem,
} from "./restaurant-floorplan-table-map";

const sampleTables: DiningTableItem[] = [
  {
    id: "tbl-1",
    tableNumber: "T-01",
    zone: "Main Dining",
    shape: "square",
    seats: 4,
    status: "seated",
    serverName: "Gianluigi B.",
    partySize: 3,
    seatedMinutes: 42,
    activeTicketTotal: 185.5,
    posX: 25,
    posY: 30,
  },
  {
    id: "tbl-2",
    tableNumber: "T-02",
    zone: "Main Dining",
    shape: "round",
    seats: 2,
    status: "available",
    posX: 55,
    posY: 30,
  },
];

describe("RestaurantFloorplanTableMap", () => {
  it("renders floorplan header, telemetry counts and table buttons", () => {
    render(
      <RestaurantFloorplanTableMap
        restaurantName="L'Osteria Meridian"
        tables={sampleTables}
      />
    );

    expect(
      screen.getByText("L'Osteria Meridian — Floorplan & Table Turn Map")
    ).toBeDefined();
    expect(screen.getByLabelText(/Table T-01, 4 seats/i)).toBeDefined();
    expect(screen.getByLabelText(/Table T-02, 2 seats/i)).toBeDefined();
    expect(screen.getByText("Table T-01")).toBeDefined();
  });

  it("selects table and updates occupancy status", () => {
    const onSelect = vi.fn();
    const onUpdate = vi.fn();
    render(
      <RestaurantFloorplanTableMap
        tables={sampleTables}
        onSelectTable={onSelect}
        onUpdateTableStatus={onUpdate}
      />
    );

    const table2 = screen.getByLabelText(/Table T-02, 2 seats/i);
    fireEvent.click(table2);

    expect(onSelect).toHaveBeenCalledWith(sampleTables[1]);
    expect(screen.getByText("Table T-02")).toBeDefined();

    const seatPartyBtn = screen.getByText("Seat Party");
    fireEvent.click(seatPartyBtn);

    expect(onUpdate).toHaveBeenCalledWith("tbl-2", "seated");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <RestaurantFloorplanTableMap tables={sampleTables} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
