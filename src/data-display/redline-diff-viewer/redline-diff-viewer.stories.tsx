import type { Meta, StoryObj } from "@storybook/react";
import { RedlineDiffViewer } from "./redline-diff-viewer";

const sampleOriginal = `Section 4.1 Indemnification.
The Service Provider agrees to defend, indemnify, and hold harmless the Customer
from and against any third-party claims arising out of gross negligence.
In no event shall either party be liable for consequential damages exceeding $50,000.
Governing Law: This agreement shall be governed by the laws of the State of Delaware.`;

const sampleRevised = `Section 4.1 Indemnification and Liability.
The Service Provider agrees to defend, indemnify, and hold harmless the Customer
from and against any third-party claims arising out of any negligence or willful misconduct.
In no event shall either party be liable for consequential damages exceeding $500,000.
Governing Law: This agreement shall be governed by the laws of the State of New York.`;

const meta: Meta<typeof RedlineDiffViewer> = {
  title: "DataDisplay/RedlineDiffViewer",
  component: RedlineDiffViewer,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    defaultViewMode: {
      control: "select",
      options: ["split", "unified"],
    },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof RedlineDiffViewer>;

export const SplitScreenRedline: Story = {
  args: {
    originalText: sampleOriginal,
    revisedText: sampleRevised,
    defaultViewMode: "split",
    documentTitle: "Master Services Agreement (MSA) - Section 4",
    density: "compact",
  },
};

export const UnifiedInlineMarkup: Story = {
  args: {
    originalText: sampleOriginal,
    revisedText: sampleRevised,
    defaultViewMode: "unified",
    documentTitle: "SaaS License Agreement - Amendment #3",
    density: "compact",
  },
};

export const UltraCompactDensity: Story = {
  args: {
    originalText: sampleOriginal,
    revisedText: sampleRevised,
    defaultViewMode: "split",
    documentTitle: "High-Throughput Audit Review",
    density: "ultra-compact",
  },
};
