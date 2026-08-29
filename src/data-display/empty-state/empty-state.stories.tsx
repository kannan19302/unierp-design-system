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

export const Filtered = () => <FilteredEmptyState onClearFilters={() => alert("Cleared")} />;
export const Error = () => <ErrorState onRetry={() => alert("Retry")} />;
export const Forbidden = () => <ForbiddenState />;
export const Loading = () => <LoadingState message="Reconciling transactions..." />;
