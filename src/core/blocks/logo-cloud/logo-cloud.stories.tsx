import type { Meta, StoryObj } from "@storybook/react";
import { LogoCloud } from "./logo-cloud";

const meta: Meta<typeof LogoCloud> = {
  title: "Blocks/LogoCloud",
  component: LogoCloud,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof LogoCloud>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <LogoCloud logos={[{ name: 'Acme Corp', icon: '🏢' }, { name: 'TechVentures', icon: '🚀' }, { name: 'GlobalRetail', icon: '🛒' }, { name: 'FinanceFirst', icon: '💰' }, { name: 'HealthPlus', icon: '🏥' }]} />
    </div>
  ),
};
