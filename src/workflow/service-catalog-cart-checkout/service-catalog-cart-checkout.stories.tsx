import type { Meta, StoryObj } from "@storybook/react";
import { ServiceCatalogCartCheckout, ServiceCartItem } from "./service-catalog-cart-checkout";

const sampleItems: ServiceCartItem[] = [
  {
    id: "item-1",
    name: "MacBook Pro 16-inch M3 Max",
    sku: "IT-HW-MBP16-01",
    category: "hardware",
    quantity: 1,
    unitPrice: 3499.0,
    billingFrequency: "one_time",
    slaDays: 3,
    specSummary: "36GB Unified Memory, 1TB SSD, Space Black",
  },
  {
    id: "item-2",
    name: "JetBrains All Products Pack",
    sku: "IT-SW-JB-002",
    category: "software_license",
    quantity: 2,
    unitPrice: 289.0,
    billingFrequency: "annual",
    slaDays: 1,
    specSummary: "Commercial Enterprise Floating Seat",
  },
  {
    id: "item-3",
    name: "AWS Sandbox Developer Environment",
    sku: "IT-CL-AWS-SBOX",
    category: "cloud_access",
    quantity: 1,
    unitPrice: 150.0,
    billingFrequency: "monthly",
    slaDays: 2,
    specSummary: "t4g.xlarge VPC subnet with EKS staging cluster",
  },
];

const sampleCostCenters = [
  "CC-4010 Engineering & Platform Systems",
  "CC-1020 Global Enterprise Finance",
  "CC-8030 Cloud Security & SRE",
  "CC-6050 Product Architecture",
];

const meta: Meta<typeof ServiceCatalogCartCheckout> = {
  title: "Workflow/ServiceCatalogCartCheckout",
  component: ServiceCatalogCartCheckout,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: { type: "select" },
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ServiceCatalogCartCheckout>;

export const Default: Story = {
  args: {
    requestId: "REQ-2026-9402",
    requesterName: "Elena Rostova",
    requesterEmail: "elena.rostova@unierp.internal",
    costCenters: sampleCostCenters,
    defaultCostCenter: sampleCostCenters[0],
    initialItems: sampleItems,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};

export const EmptyCart: Story = {
  args: {
    requestId: "REQ-2026-9405",
    requesterName: "Marcus Vance",
    requesterEmail: "marcus.vance@unierp.internal",
    costCenters: sampleCostCenters,
    initialItems: [],
    density: "compact",
  },
};
