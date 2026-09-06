import type { Meta, StoryObj } from "@storybook/react";
import { BulletChart } from "./bullet-chart";

const meta: Meta<typeof BulletChart> = {
  title: "Charts/BulletChart",
  component: BulletChart,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof BulletChart>;

export const Default: Story = {
  render: () => {
    
    return (
      <div style={{ width: 500, padding: "var(--space-4)" }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', width: 400 }}>
        <BulletChart label="Revenue" actual={275} target={300} ranges={[150, 225, 350]} unit="K" />
        <BulletChart label="Satisfaction" actual={4.2} target={4.5} ranges={[3, 4, 5]} />
        <BulletChart label="New Clients" actual={85} target={100} ranges={[50, 75, 120]} />
      </div>
      </div>
    );
  },
};
