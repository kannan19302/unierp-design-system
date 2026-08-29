import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton, SkeletonText } from "./skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: 240,
    height: 20,
  },
};

export const Circle: Story = {
  args: {
    width: 48,
    height: 48,
    circle: true,
  },
};

export const TextBlock = () => (
  <div style={{ width: 320 }}>
    <SkeletonText lines={4} />
  </div>
);

export const CardPreview = () => (
  <div
    style={{
      width: 280,
      padding: "var(--space-4)",
      border: "1px solid var(--surface-1-border)",
      borderRadius: "var(--radius-md)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
    }}
  >
    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
      <Skeleton width={40} height={40} circle />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <Skeleton height={14} width="70%" />
        <Skeleton height={10} width="40%" />
      </div>
    </div>
    <Skeleton height={120} />
    <SkeletonText lines={2} />
  </div>
);
