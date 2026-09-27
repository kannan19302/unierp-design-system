import type { Meta, StoryObj } from "@storybook/react";
import { RedlineDiffViewer, DiffViewer } from "./diff-viewer";

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
  title: "Compositions/RedlineDiffViewer",
  component: RedlineDiffViewer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultViewMode: {
      control: "select",
      options: ["split", "unified"],
      description: "Default display mode: split side-by-side or unified stacked.",
    },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
    documentTitle: {
      control: "text",
      description: "Title shown in the toolbar.",
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

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Ultra-Compact (24px line height)</h4>
        <DiffViewer
          originalText={sampleOriginal}
          revisedText={sampleRevised}
          density="ultra-compact"
          documentTitle="Ultra-Compact Audit Diff"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Compact (28px line height)</h4>
        <DiffViewer
          originalText={sampleOriginal}
          revisedText={sampleRevised}
          density="compact"
          documentTitle="Compact Standard Diff"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Standard (32px line height)</h4>
        <DiffViewer
          originalText={sampleOriginal}
          revisedText={sampleRevised}
          density="standard"
          documentTitle="Standard Legal Review Diff"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Comfortable (40px line height)</h4>
        <DiffViewer
          originalText={sampleOriginal}
          revisedText={sampleRevised}
          density="comfortable"
          documentTitle="Comfortable Executive Diff"
        />
      </div>
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <RedlineDiffViewer {...args} />
    </div>
  ),
  args: {
    originalText: sampleOriginal,
    revisedText: sampleRevised,
    documentTitle: "Anatomy of Redline Diff Viewer",
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Split View Mode</h4>
        <RedlineDiffViewer
          originalText={sampleOriginal}
          revisedText={sampleRevised}
          defaultViewMode="split"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Unified View Mode</h4>
        <RedlineDiffViewer
          originalText={sampleOriginal}
          revisedText={sampleRevised}
          defaultViewMode="unified"
        />
      </div>
    </div>
  ),
};
