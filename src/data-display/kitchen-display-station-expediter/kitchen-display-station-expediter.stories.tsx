import type { Meta, StoryObj } from "@storybook/react";
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
        modifiers: ["Medium Rare", "Truffle Butter (+)"],
        isCompleted: false,
      },
      {
        id: "item_02",
        name: "Wild Mushroom Risotto",
        quantity: 1,
        modifiers: ["No Chives"],
        isCompleted: true,
      },
    ],
  },
  {
    ticketId: "T-105",
    tableNumber: "VIP Booth 2",
    serverName: "Chloe R.",
    elapsedMinutes: 7,
    orderType: "VIP",
    status: "PREPARING",
    items: [
      {
        id: "item_03",
        name: "Pan-Seared Chilean Sea Bass",
        quantity: 1,
        modifiers: ["Crispy Skin", "Miso Glaze"],
        isCompleted: false,
      },
      {
        id: "item_04",
        name: "Charred Broccolini",
        quantity: 1,
        isCompleted: false,
      },
    ],
  },
  {
    ticketId: "T-106",
    tableNumber: "Bar Top 4",
    serverName: "Leo D.",
    elapsedMinutes: 4,
    orderType: "TAKEOUT",
    status: "NEW",
    items: [
      {
        id: "item_05",
        name: "Wagyu Smash Burger & Truffle Fries",
        quantity: 2,
        modifiers: ["Gluten-Free Bun (Table 4)"],
        isCompleted: false,
      },
    ],
  },
];

const meta: Meta<typeof KitchenDisplayStationExpediter> = {
  title: "Data Display/KitchenDisplayStationExpediter",
  component: KitchenDisplayStationExpediter,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof KitchenDisplayStationExpediter>;

export const Default: Story = {
  args: {
    stationName: "Station 2 - Grill & Hot Entrées",
    ticketOrders: sampleTickets,
  },
};

export const UltraCompact: Story = {
  args: {
    stationName: "Station 2 - Grill & Hot Entrées",
    ticketOrders: sampleTickets,
    density: "ultra-compact",
  },
};
