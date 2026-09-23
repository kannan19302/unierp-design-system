import type { Meta, StoryObj } from "@storybook/react";
import { CohortRetentionChart } from "./cohort-retention-chart";

const SAMPLE_COHORTS = [
  { label: "Jan 2024", initialSize: 1200, retentionPcts: [100, 75, 60, 52, 48, 45] },
  { label: "Feb 2024", initialSize: 1450, retentionPcts: [100, 80, 65, 58, 54] },
  { label: "Mar 2024", initialSize: 1300, retentionPcts: [100, 72, 58, 50] },
  { label: "Apr 2024", initialSize: 1600, retentionPcts: [100, 82, 69] },
  { label: "May 2024", initialSize: 1750, retentionPcts: [100, 85] },
  { label: "Jun 2024", initialSize: 1900, retentionPcts: [100] },
];

const meta: Meta<typeof CohortRetentionChart> = {
  title: "Core/Charts/CohortRetentionChart",
  component: CohortRetentionChart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof CohortRetentionChart>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "680px", padding: "var(--space-4)" }}>
      <CohortRetentionChart cohorts={SAMPLE_COHORTS} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "720px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <CohortRetentionChart cohorts={SAMPLE_COHORTS} periodLabel="Month" />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "720px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Full 6-Month Cohort
        </h4>
        <CohortRetentionChart cohorts={SAMPLE_COHORTS} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Quarterly Rollup
        </h4>
        <CohortRetentionChart cohorts={SAMPLE_COHORTS.slice(0, 3)} periodLabel="Qtr" />
      </div>
    </div>
  ),
};
