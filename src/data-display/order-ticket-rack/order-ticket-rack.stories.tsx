import type { Meta, StoryObj } from "@storybook/react";
import { OrderTicketRack, OrderTicket } from "./order-ticket-rack";

const SAMPLE_TICKETS: OrderTicket[] = [
  {
    id: "ticket-101",
    orderNumber: "101",
    destination: "Dine-In",
    tableOrChannel: "Table 14",
    serverOrCustomerName: "Server: Marco",
    elapsedSeconds: 145,
    targetSeconds: 600,
    items: [
      { id: "i1", name: "Truffle Wagyu Burger", quantity: 2, modifiers: ["Medium Rare", "No Onions"] },
      { id: "i2", name: "Parmesan Truffle Fries", quantity: 1 },
      { id: "i3", name: "San Pellegrino 750ml", quantity: 2, isCompleted: true },
    ],
  },
  {
    id: "ticket-102",
    orderNumber: "102",
    destination: "Takeout",
    tableOrChannel: "Counter Pickup",
    serverOrCustomerName: "Customer: Sarah L.",
    elapsedSeconds: 420,
    targetSeconds: 600,
    items: [
      { id: "i4", name: "Spicy Miso Ramen", quantity: 1, modifiers: ["Extra Chashu", "Gluten-Free Noodle"] },
      { id: "i5", name: "Pan-Fried Gyoza (6pc)", quantity: 1, isCompleted: true },
    ],
  },
  {
    id: "ticket-103",
    orderNumber: "103",
    destination: "Delivery",
    tableOrChannel: "UberEats #9842",
    elapsedSeconds: 780, // Overdue
    targetSeconds: 600,
    items: [
      { id: "i6", name: "Margherita Wood-Fired Pizza", quantity: 2, modifiers: ["Well Done Crust"] },
      { id: "i7", name: "Burrata Caprese Salad", quantity: 1 },
      { id: "i8", name: "Tiramisu Classico", quantity: 2 },
    ],
  },
];

const meta: Meta<typeof OrderTicketRack> = {
  title: "DataDisplay/OrderTicketRack",
  component: OrderTicketRack,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OrderTicketRack>;

export const Default: Story = {
  args: {
    title: "Kitchen Display System (KDS)",
    tickets: SAMPLE_TICKETS,
  },
};

export const EmptyQueue: Story = {
  args: {
    title: "Kitchen Display System (KDS)",
    tickets: [],
  },
};
