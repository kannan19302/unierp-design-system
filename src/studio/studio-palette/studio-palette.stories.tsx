import type { Meta, StoryObj } from "@storybook/react";
import { StudioPalette, type PaletteGroup } from "./studio-palette";

const MOCK_GROUPS: PaletteGroup[] = [
  {
    id: "layout",
    label: "Layout Elements",
    items: [
      { id: "hero", label: "Hero Header", keywords: ["banner", "intro"] },
      { id: "features", label: "Features Grid", keywords: ["columns", "cards"] },
      { id: "pricing", label: "Pricing Table", keywords: ["tiers", "plans"] },
    ],
  },
  {
    id: "forms",
    label: "Interactive Inputs",
    items: [
      { id: "text-input", label: "Text Input", keywords: ["field", "string"] },
      { id: "select", label: "Dropdown Select", keywords: ["options", "picker"] },
      { id: "button", label: "Submit Button", keywords: ["cta", "action"] },
    ],
  },
];

const meta: Meta<typeof StudioPalette> = {
  title: "Studio/StudioPalette",
  component: StudioPalette,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof StudioPalette>;

export const Default: Story = {
  args: {
    groups: MOCK_GROUPS,
    onInsert: (item) => alert(`Inserted item: ${item.label}`),
  },
};
