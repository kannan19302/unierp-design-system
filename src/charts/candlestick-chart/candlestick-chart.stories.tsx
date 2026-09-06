import type { Meta, StoryObj } from "@storybook/react";
import { CandlestickChart } from "./candlestick-chart";

const meta: Meta<typeof CandlestickChart> = {
  title: "Charts/CandlestickChart",
  component: CandlestickChart,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof CandlestickChart>;

export const Default: Story = {
  render: () => {
    const data = [
    { date: '2026-01', open: 142, high: 155, low: 138, close: 150 },
    { date: '2026-02', open: 150, high: 162, low: 147, close: 145 },
    { date: '2026-03', open: 145, high: 158, low: 140, close: 156 },
    { date: '2026-04', open: 156, high: 168, low: 152, close: 160 },
    { date: '2026-05', open: 160, high: 170, low: 155, close: 153 },
    { date: '2026-06', open: 153, high: 165, low: 148, close: 163 },
    { date: '2026-07', open: 163, high: 175, low: 160, close: 172 },
  ];
    return (
      <div style={{ width: 500, padding: "var(--space-4)" }}>
        <CandlestickChart data={data} />
      </div>
    );
  },
};
