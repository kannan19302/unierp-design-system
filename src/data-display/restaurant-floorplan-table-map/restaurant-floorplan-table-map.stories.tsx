import type { Meta, StoryObj } from "@storybook/react";
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
  {
    id: "tbl-3",
    tableNumber: "T-03",
    zone: "Patio",
    shape: "rectangle",
    seats: 6,
    status: "check_dropped",
    serverName: "Alessia M.",
    partySize: 5,
    seatedMinutes: 75,
    activeTicketTotal: 340.0,
    posX: 80,
    posY: 50,
  },
  {
    id: "tbl-4",
    tableNumber: "B-01",
    zone: "Bar",
    shape: "bar_stool",
    seats: 1,
    status: "dirty",
    posX: 20,
    posY: 75,
  },
  {
    id: "tbl-5",
    tableNumber: "B-02",
    zone: "Bar",
    shape: "bar_stool",
    seats: 1,
    status: "reserved",
    posX: 35,
    posY: 75,
  },
];

const meta: Meta<typeof RestaurantFloorplanTableMap> = {
  title: "Data Display/RestaurantFloorplanTableMap",
  component: RestaurantFloorplanTableMap,
  parameters: {
    layout: "padded",
  },
  args: {
    restaurantName: "L'Osteria Meridian Ristorante",
    shiftLabel: "Friday Dinner Service (Turn 2)",
    tables: sampleTables,
  },
};

export default meta;
type Story = StoryObj<typeof RestaurantFloorplanTableMap>;

export const Default: Story = {
  args: {},
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
  },
};
