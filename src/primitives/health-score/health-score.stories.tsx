import type { Meta, StoryObj } from "@storybook/react";
import { HealthScore } from "./health-score";

const meta: Meta<typeof HealthScore> = {
  title: "Primitives/HealthScore",
  component: HealthScore,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "System vitality and account health indicator. Maps percentage scores (0-100%) to semantic statuses (Good: >=80%, Fair: 50-79%, Poor: <50%) across pill capsule and compact text variants.",
      },
    },
  },
  argTypes: {
    score: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Numerical health percentage from 0 to 100.",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "100" },
      },
    },
    variant: {
      control: "radio",
      options: ["text", "pill"],
      description: "Visual container format.",
      table: {
        type: { summary: "text | pill" },
        defaultValue: { summary: "text" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HealthScore>;

export const Good: Story = {
  args: { score: 95 },
};

export const Fair: Story = {
  args: { score: 65 },
};

export const Poor: Story = {
  args: { score: 32 },
};

export const PillVariants = () => (
  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
    <HealthScore score={98} variant="pill" showLabel />
    <HealthScore score={72} variant="pill" showLabel />
    <HealthScore score={28} variant="pill" showLabel />
  </div>
);

export const TextVariants = () => (
  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
    <HealthScore score={95} variant="text" />
    <HealthScore score={65} variant="text" />
    <HealthScore score={30} variant="text" />
  </div>
);

export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 500 }}>
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
      Sub-elements: Heart Icon + Score Percentage + Semantic Status Label
    </div>
    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
      <HealthScore score={94} variant="pill" />
      <HealthScore score={62} variant="text" />
    </div>
  </div>
);

export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
    {/* Row 1: Pill Capsule Variants */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Capsule Pill Tier (Good >= 80%, Fair 50-79%, Poor &lt; 50%)
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
        <HealthScore score={96} variant="pill" />
        <HealthScore score={68} variant="pill" />
        <HealthScore score={34} variant="pill" />
      </div>
    </div>

    {/* Row 2: Compact Text Variants */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Compact Inset Text Tier
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
        <HealthScore score={92} variant="text" />
        <HealthScore score={54} variant="text" />
        <HealthScore score={18} variant="text" />
      </div>
    </div>
  </div>
);

