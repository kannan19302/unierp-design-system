import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./empty-state";
import { FilteredEmptyState, ErrorState, ForbiddenState, LoadingState } from "./six-states";
import { FilePlus } from "lucide-react";
import { Button } from "../../primitives/button";

const meta: Meta<typeof EmptyState> = {
  title: "Compositions/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
    title: {
      control: "text",
      description: "Primary headline describing empty state condition.",
    },
    description: {
      control: "text",
      description: "Secondary explanatory copy or guidance.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    density: "standard",
    icon: <FilePlus size={20} />,
    title: "No General Ledger Vouchers",
    description: "Create your first journal voucher or import initial opening balances.",
    action: <Button variant="primary" size="sm">Create Voucher</Button>,
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    ...Default.args,
  },
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Ultra-Compact (16px padding / 28px icon)</h4>
        <EmptyState
          density="ultra-compact"
          icon={<FilePlus size={16} />}
          title="No Items"
          description="Empty table cell partition."
          action={<Button variant="primary" size="xs">Add</Button>}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Compact (24px padding / 36px icon)</h4>
        <EmptyState
          density="compact"
          icon={<FilePlus size={18} />}
          title="No Records Found"
          description="Adjust your search filters."
          action={<Button variant="primary" size="sm">Reset</Button>}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Standard (32px padding / 44px icon)</h4>
        <EmptyState
          density="standard"
          icon={<FilePlus size={20} />}
          title="No General Ledger Vouchers"
          description="Create your first journal voucher."
          action={<Button variant="primary" size="sm">Create Voucher</Button>}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Comfortable (48px padding / 56px icon)</h4>
        <EmptyState
          density="comfortable"
          icon={<FilePlus size={24} />}
          title="Get Started With Invoicing"
          description="Issue invoices, track billing statuses, and connect automated payment gateways."
          action={<Button variant="primary" size="md">Launch Invoicing</Button>}
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>Empty Initial State</h4>
        <EmptyState
          icon={<FilePlus size={20} />}
          title="No Data Available"
          description="Get started by creating a new entry."
          action={<Button variant="primary" size="sm">Add Entry</Button>}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>Filtered State</h4>
        <FilteredEmptyState onClearFilters={() => alert("Cleared")} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>Error State</h4>
        <ErrorState onRetry={() => alert("Retry")} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>Forbidden State</h4>
        <ForbiddenState />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>Loading State</h4>
        <LoadingState message="Reconciling transactions..." />
      </div>
    </div>
  ),
};

export const Filtered = () => <FilteredEmptyState onClearFilters={() => alert("Cleared")} />;
export const Error = () => <ErrorState onRetry={() => alert("Retry")} />;
export const Forbidden = () => <ForbiddenState />;
export const Loading = () => <LoadingState message="Reconciling transactions..." />;
