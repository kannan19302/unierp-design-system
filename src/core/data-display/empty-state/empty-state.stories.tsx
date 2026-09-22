import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./empty-state";
import { FilteredEmptyState, ErrorState, ForbiddenState, LoadingState } from "./six-states";
import { FilePlus } from "lucide-react";
import { Button } from "../../primitives/button";

const meta: Meta<typeof EmptyState> = {
  title: "DataDisplay/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
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
