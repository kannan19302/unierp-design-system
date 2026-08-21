import type { Meta, StoryObj } from "@storybook/react";
import { Alert, Banner, InlineMessage, Progress, ToastProvider, useToast } from "./feedback";
import { Skeleton } from "./skeleton";
import { Button } from "./button";

/**
 * Rewritten against the real API. This file previously imported `Toast` and
 * `Skeleton` from "./feedback" — feedback.tsx exports neither (it exposes
 * `ToastProvider` + `useToast`, and Skeleton lives in ./skeleton) — and passed
 * a `message` prop to Alert and Banner, which both take `children`. None of it
 * could compile, and it went unnoticed because Storybook was mounted at a path
 * where it found no story files at all.
 */
const meta: Meta = {
  title: "Components/Feedback",
};

export default meta;

export const AlertDefault: StoryObj = {
  render: () => (
    <Alert variant="info" title="Info">
      This is an informative message.
    </Alert>
  ),
};

export const AlertVariants: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Alert variant="info" title="Info">Scheduled import finished.</Alert>
      <Alert variant="success" title="Success">Invoice INV-2026-0891 posted.</Alert>
      <Alert variant="warning" title="Warning">Three connectors are out of date.</Alert>
      <Alert variant="danger" title="Danger">Payment gateway rejected the last batch.</Alert>
    </div>
  ),
};

export const BannerDefault: StoryObj = {
  render: () => <Banner variant="warning">System maintenance scheduled at midnight.</Banner>,
};

export const InlineMessageDefault: StoryObj = {
  render: () => <InlineMessage variant="danger">Enter a valid tax identifier.</InlineMessage>,
};

export const ProgressDefault: StoryObj = {
  render: () => <Progress value={75} label="Import progress" showPercent />,
};

export const SkeletonDefault: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 320 }}>
      <Skeleton width="60%" height={20} />
      <Skeleton width="100%" height={14} />
      <Skeleton width="90%" height={14} />
    </div>
  ),
};

/** Toasts are raised through the provider's hook, not rendered directly. */
function ToastDemo() {
  const { add } = useToast();
  return (
    <Button onClick={() => add({ message: "Operation succeeded", variant: "success" })}>
      Raise a toast
    </Button>
  );
}

export const ToastDefault: StoryObj = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};
