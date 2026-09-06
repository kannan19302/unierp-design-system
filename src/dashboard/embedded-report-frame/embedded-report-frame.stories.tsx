import type { Meta, StoryObj } from "@storybook/react";
import { EmbeddedReportFrame } from "./embedded-report-frame";

const meta: Meta<typeof EmbeddedReportFrame> = {
  title: "Dashboard/EmbeddedReportFrame",
  component: EmbeddedReportFrame,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof EmbeddedReportFrame>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <EmbeddedReportFrame title="Q3 Revenue Report" src="https://reports.example.com/q3-revenue" />
    </div>
  ),
};
