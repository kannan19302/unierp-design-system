import type { Meta, StoryObj } from "@storybook/react";
import { StudioConsole, type StudioProblem } from "./studio-console";

const MOCK_PROBLEMS: StudioProblem[] = [
  {
    id: "p1",
    severity: "error",
    message: "Missing mandatory form action endpoint",
    where: "Lead Capture Form",
    targetId: "form-01",
  },
  {
    id: "p2",
    severity: "warning",
    message: "Image asset is missing an alt description",
    where: "Hero Banner",
    targetId: "hero-img",
  },
];

const meta: Meta<typeof StudioConsole> = {
  title: "Studio/StudioConsole",
  component: StudioConsole,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof StudioConsole>;

export const Expanded: Story = {
  args: {
    problems: MOCK_PROBLEMS,
    defaultOpen: true,
    output: "Compilation completed in 184ms. 1 error, 1 warning.",
  },
};
