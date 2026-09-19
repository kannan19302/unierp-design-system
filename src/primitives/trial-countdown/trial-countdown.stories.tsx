import type { Meta, StoryObj } from "@storybook/react";
import { TrialCountdown } from "./trial-countdown";

const meta: Meta<typeof TrialCountdown> = {
  title: "Primitives/TrialCountdown",
  component: TrialCountdown,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof TrialCountdown>;

export const Active: Story = {
  args: {
    endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

export const Expired: Story = {
  args: {
    endsAt: new Date(Date.now() - 1000).toISOString(),
  },
};

export const UrgencyMatrix = () => {
  const now = Date.now();
  const normalEndsAt = new Date(now + 12 * 24 * 60 * 60 * 1000).toISOString();
  const warningEndsAt = new Date(now + 2 * 24 * 60 * 60 * 1000 + 4 * 3600 * 1000).toISOString();
  const criticalEndsAt = new Date(now + 5 * 3600 * 1000 + 30 * 60 * 1000).toISOString();
  const expiredEndsAt = new Date(now - 1000).toISOString();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-1)" }}>
          Standard Active State (&gt; 3 Days)
        </div>
        <TrialCountdown endsAt={normalEndsAt} />
      </div>
      <div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-1)" }}>
          Warning State (&le; 3 Days)
        </div>
        <TrialCountdown endsAt={warningEndsAt} />
      </div>
      <div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-1)" }}>
          Critical State (&lt; 24 Hours)
        </div>
        <TrialCountdown endsAt={criticalEndsAt} />
      </div>
      <div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-1)" }}>
          Expired State
        </div>
        <TrialCountdown endsAt={expiredEndsAt} />
      </div>
    </div>
  );
};
