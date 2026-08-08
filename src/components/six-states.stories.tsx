import type { Meta, StoryObj } from "@storybook/react";
import {
  LoadingState,
  EmptyState,
  FilteredEmptyState,
  ErrorState,
  ForbiddenState,
  PartialState,
} from "./six-states";

const meta: Meta = {
  title: "Components/SixStates",
};

export default meta;

export const Loading: StoryObj = {
  render: () => <LoadingState message="Loading data..." />,
};

export const Empty: StoryObj = {
  render: () => <EmptyState title="No Records" description="No data to display." />,
};

export const FilteredEmpty: StoryObj = {
  render: () => <FilteredEmptyState onClearFilters={() => alert("Filters cleared")} />,
};

export const Error: StoryObj = {
  render: () => <ErrorState onRetry={() => alert("Retrying")} />,
};

export const Forbidden: StoryObj = {
  render: () => <ForbiddenState />,
};

export const Partial: StoryObj = {
  render: () => <PartialState onRefresh={() => alert("Refreshed")} />,
};
