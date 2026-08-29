import type { Meta, StoryObj } from "@storybook/react";
import { StudioToolbar } from "./studio-toolbar";

const meta: Meta<typeof StudioToolbar> = {
  title: "Studio/StudioToolbar",
  component: StudioToolbar,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof StudioToolbar>;

export const Default: Story = {
  args: {
    name: "Customer Portal Registration",
    kind: "Form Layout",
    version: "v1.4.2 · Draft",
    dirty: true,
    problemCount: 0,
    validate: { onAction: () => alert("Validation Passed") },
    preview: { onAction: () => alert("Opening Preview") },
    testRun: { onAction: () => alert("Running Test Execution") },
    version_: { onAction: () => alert("Viewing Version History") },
    publish: { onAction: () => alert("Opening Publish Diff Dialog") },
  },
};
