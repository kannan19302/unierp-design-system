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

export const DataTableSkeleton = () => (
  <div
    style={{
      width: "100%",
      maxWidth: 640,
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      background: "var(--color-bg-surface)",
      overflow: "hidden",
    }}
  >
    {/* Table Header */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "32px 1fr 120px 100px 80px",
        gap: "var(--space-3)",
        padding: "var(--space-3) var(--space-4)",
        background: "var(--color-bg-muted)",
        borderBottom: "1px solid var(--color-border)",
        alignItems: "center",
      }}
    >
      <Skeleton width={16} height={16} radius="var(--radius-xs)" />
      <Skeleton width="60%" height={12} />
      <Skeleton width="50%" height={12} />
      <Skeleton width="70%" height={12} />
      <Skeleton width="40%" height={12} />
    </div>
    {/* Table Rows */}
    {[1, 2, 3, 4].map((row) => (
      <div
        key={row}
        style={{
          display: "grid",
          gridTemplateColumns: "32px 1fr 120px 100px 80px",
          gap: "var(--space-3)",
          padding: "var(--space-3) var(--space-4)",
          borderBottom: row < 4 ? "1px solid var(--color-border-subtle)" : "none",
          alignItems: "center",
        }}
      >
        <Skeleton width={16} height={16} radius="var(--radius-xs)" />
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <Skeleton width={24} height={24} circle />
          <Skeleton width={row % 2 === 0 ? "75%" : "55%"} height={12} />
        </div>
        <Skeleton width="70%" height={12} />
        <Skeleton width={64} height={20} radius="var(--radius-full)" />
        <Skeleton width="50%" height={12} />
      </div>
    ))}
  </div>
);
