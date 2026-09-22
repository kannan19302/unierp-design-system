import type { Meta, StoryObj } from "@storybook/react";
import { ClinicalEdcFieldVerifier } from "./clinical-edc-field-verifier";

const meta: Meta<typeof ClinicalEdcFieldVerifier> = {
  title: "Workflow/ClinicalEdcFieldVerifier",
  component: ClinicalEdcFieldVerifier,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ClinicalEdcFieldVerifier>;

export const Default: Story = {
  args: {
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
    studyProtocolNumber: "PROTO-IMMUNO-301",
    subjectId: "SUBJ-2088-B",
  },
};

export const Comfortable: Story = {
  args: {
    density: "comfortable",
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    density: "standard",
  },
  render: (args) => (
    <div style={{ inlineSize: "100%", maxInlineSize: "960px" }}>
      <ClinicalEdcFieldVerifier {...args} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Compact Workbench</h4>
        <ClinicalEdcFieldVerifier density="compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Ultra-Compact View</h4>
        <ClinicalEdcFieldVerifier density="ultra-compact" studyProtocolNumber="PROTO-IMMUNO-301" subjectId="SUBJ-2088-B" />
      </div>
    </div>
  ),
};
