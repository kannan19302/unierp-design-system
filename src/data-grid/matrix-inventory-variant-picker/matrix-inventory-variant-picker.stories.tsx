import type { Meta, StoryObj } from "@storybook/react";
import { MatrixInventoryVariantPicker } from "./matrix-inventory-variant-picker";

const meta: Meta<typeof MatrixInventoryVariantPicker> = {
  title: "Data Grid/MatrixInventoryVariantPicker",
  component: MatrixInventoryVariantPicker,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MatrixInventoryVariantPicker>;

const sampleStock = {
  "XS__Obsidian Black": { quantity: 15, reserved: 2, skuSuffix: "BLK-XS" },
  "S__Obsidian Black": { quantity: 45, reserved: 10, skuSuffix: "BLK-S" },
  "M__Obsidian Black": { quantity: 80, reserved: 12, skuSuffix: "BLK-M" },
  "L__Obsidian Black": { quantity: 60, reserved: 8, skuSuffix: "BLK-L" },
  "XL__Obsidian Black": { quantity: 24, reserved: 5, skuSuffix: "BLK-XL" },
  "2XL__Obsidian Black": { quantity: 8, reserved: 0, skuSuffix: "BLK-2XL" },
  "XS__Navy Blue": { quantity: 12, reserved: 0, skuSuffix: "NVY-XS" },
  "S__Navy Blue": { quantity: 38, reserved: 4, skuSuffix: "NVY-S" },
  "M__Navy Blue": { quantity: 55, reserved: 6, skuSuffix: "NVY-M" },
  "L__Navy Blue": { quantity: 40, reserved: 2, skuSuffix: "NVY-L" },
  "XL__Navy Blue": { quantity: 18, reserved: 1, skuSuffix: "NVY-XL" },
  "2XL__Navy Blue": { quantity: 5, reserved: 0, skuSuffix: "NVY-2XL" },
  "XS__Alpine Sage": { quantity: 9, reserved: 0, skuSuffix: "SGE-XS" },
  "S__Alpine Sage": { quantity: 22, reserved: 3, skuSuffix: "SGE-S" },
  "M__Alpine Sage": { quantity: 34, reserved: 5, skuSuffix: "SGE-M" },
  "L__Alpine Sage": { quantity: 28, reserved: 2, skuSuffix: "SGE-L" },
  "XL__Alpine Sage": { quantity: 12, reserved: 0, skuSuffix: "SGE-XL" },
  "2XL__Alpine Sage": { quantity: 4, reserved: 0, skuSuffix: "SGE-2XL" },
  "XS__Arctic White": { quantity: 6, reserved: 1, skuSuffix: "WHT-XS" },
  "S__Arctic White": { quantity: 18, reserved: 2, skuSuffix: "WHT-S" },
  "M__Arctic White": { quantity: 25, reserved: 3, skuSuffix: "WHT-M" },
  "L__Arctic White": { quantity: 20, reserved: 1, skuSuffix: "WHT-L" },
  "XL__Arctic White": { quantity: 9, reserved: 0, skuSuffix: "WHT-XL" },
  "2XL__Arctic White": { quantity: 2, reserved: 0, skuSuffix: "WHT-2XL" },
};

export const Default: Story = {
  args: {
    productTitle: "Meridian Technical Waterproof Parka",
    baseSku: "PRK-900",
    wholesalePrice: 145.0,
    msrp: 295.0,
    xAxisAttributeName: "Color",
    xAxisValues: ["Obsidian Black", "Navy Blue", "Alpine Sage", "Arctic White"],
    yAxisAttributeName: "Size",
    yAxisValues: ["XS", "S", "M", "L", "XL", "2XL"],
    initialStockMatrix: sampleStock,
    lowStockThreshold: 10,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};

export const Standard: Story = {
  args: {
    ...Default.args,
    density: "standard",
  },
};
