import type { Meta, StoryObj } from "@storybook/react";
import { Alert, Toast, Banner, Progress, Skeleton } from "./feedback";

const meta: Meta = {
  title: "Components/Feedback",
};

export default meta;

export const AlertDefault: StoryObj = {
  render: () => <Alert variant="info" title="Info" message="This is an informative message." />,
};

export const ToastDefault: StoryObj = {
  render: () => <Toast message="Operation succeeded" variant="success" onClose={() => {}} />,
};

export const BannerDefault: StoryObj = {
  render: () => <Banner variant="warning" message="System maintenance scheduled at midnight." />,
};

export const ProgressDefault: StoryObj = {
  render: () => <Progress value={75} max={100} />,
};

export const SkeletonDefault: StoryObj = {
  render: () => <Skeleton width="100%" height={24} />,
};
