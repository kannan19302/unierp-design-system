import type { Meta, StoryObj } from "@storybook/react";
import { CohortRetentionChart } from "./cohort-retention-chart";

const meta: Meta<typeof CohortRetentionChart> = {
  title: "Charts/CohortRetentionChart",
  component: CohortRetentionChart,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof CohortRetentionChart>;

export const Default: Story = {
  render: () => {
    const cohorts = [
    { label: 'Jan 2026', initialSize: 1200, retentionPcts: [100, 72, 58, 45, 38, 32] },
    { label: 'Feb 2026', initialSize: 1450, retentionPcts: [100, 68, 52, 40, 34] },
    { label: 'Mar 2026', initialSize: 1100, retentionPcts: [100, 75, 60, 48] },
    { label: 'Apr 2026', initialSize: 1380, retentionPcts: [100, 70, 55] },
    { label: 'May 2026', initialSize: 1600, retentionPcts: [100, 73] },
  ];
    return (
      <div style={{ width: 500, padding: "var(--space-4)" }}>
        <CohortRetentionChart cohorts={cohorts} />
      </div>
    );
  },
};
