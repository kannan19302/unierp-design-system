import type { Meta, StoryObj } from "@storybook/react";
import { PeriodCloseCockpit } from "./period-close-cockpit";
import type { CloseTask } from "./period-close-cockpit";

const mockTasks: CloseTask[] = [
  {
    id: "task-ap",
    title: "Accounts Payable Invoice Matching & Hard Lock",
    category: "Subledger AP/AR",
    owner: "Elena Rostova",
    dueDate: "2026-09-02",
    status: "completed",
    actionLabel: "AP Ledger",
  },
  {
    id: "task-ar",
    title: "Accounts Receivable Revenue Accruals & Lock",
    category: "Subledger AP/AR",
    owner: "David Chen",
    dueDate: "2026-09-02",
    status: "completed",
    actionLabel: "AR Ledger",
  },
  {
    id: "task-fa",
    title: "Run Fixed Asset Depreciation Batch Schedule",
    category: "Assets & Inventory",
    owner: "Marcus Vance",
    dueDate: "2026-09-03",
    status: "completed",
    prerequisiteTaskIds: ["task-ap"],
    actionLabel: "Depreciation",
  },
  {
    id: "task-recon",
    title: "Bank Statement Multi-Account Reconciliation",
    category: "Reconciliation & Tax",
    owner: "Sarah Jenkins",
    dueDate: "2026-09-04",
    status: "in-progress",
    prerequisiteTaskIds: ["task-ap", "task-ar"],
    exceptionCount: 2,
    actionLabel: "Matcher",
  },
  {
    id: "task-intercompany",
    title: "Intercompany Elimination & FX Currency Revaluation",
    category: "Consolidation & GL",
    owner: "Claire Dupont",
    dueDate: "2026-09-05",
    status: "pending",
    prerequisiteTaskIds: ["task-recon", "task-fa"],
    actionLabel: "Eliminations",
  },
  {
    id: "task-gl-close",
    title: "Hard Lock General Ledger & Generate Balance Sheet",
    category: "Consolidation & GL",
    owner: "Alex Rivera (Controller)",
    dueDate: "2026-09-06",
    status: "pending",
    prerequisiteTaskIds: ["task-intercompany"],
    actionLabel: "GL Console",
  },
];

const meta: Meta<typeof PeriodCloseCockpit> = {
  title: "Workflow/PeriodCloseCockpit",
  component: PeriodCloseCockpit,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof PeriodCloseCockpit>;

export const QuarterEndInProgress: Story = {
  args: {
    fiscalPeriod: "FY2026-Q3 (September 2026 Close)",
    tasks: mockTasks,
    isHardLocked: false,
    density: "compact",
  },
};

export const FullyCompletedReadyToLock: Story = {
  args: {
    fiscalPeriod: "FY2026-Q2 (June 2026 Close)",
    tasks: mockTasks.map((t) => ({ ...t, status: "completed", exceptionCount: 0 })),
    isHardLocked: false,
    density: "compact",
  },
};

export const PeriodLockedArchived: Story = {
  args: {
    fiscalPeriod: "FY2026-Q1 (March 2026 Close)",
    tasks: mockTasks.map((t) => ({ ...t, status: "completed", exceptionCount: 0 })),
    isHardLocked: true,
    density: "compact",
  },
};
