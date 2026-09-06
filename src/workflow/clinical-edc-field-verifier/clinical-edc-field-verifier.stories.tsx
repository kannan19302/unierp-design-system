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
