import type { Meta, StoryObj } from "@storybook/react";
import { MerkleProofAuditTrailVerifier } from "./merkle-proof-audit-trail-verifier";

const meta: Meta<typeof MerkleProofAuditTrailVerifier> = {
  title: "DataDisplay/MerkleProofAuditTrailVerifier",
  component: MerkleProofAuditTrailVerifier,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MerkleProofAuditTrailVerifier>;

const mockTarget = {
  leafIndex: 42,
  entityId: "GL-JOURNAL-2026-0906-881",
  leafHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  timestamp: "2026-09-06T08:15:30Z",
  authorizingKey: "0x892aF04b73cD109A8e9944aFb3dC84C01e94B9c2",
  proofPath: [
    {
      level: 1,
      position: "RIGHT" as const,
      hash: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    },
    {
      level: 2,
      position: "LEFT" as const,
      hash: "fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9",
    },
    {
      level: 3,
      position: "RIGHT" as const,
      hash: "315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3",
    },
  ],
};

export const Default: Story = {
  args: {
    expectedRootHash: "7d793037a0760186574b0282f2f435e70ec71e169d275743b40f8b4be14ecdbf",
    blockEpoch: 489210,
    targetRecord: mockTarget,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    expectedRootHash: "7d793037a0760186574b0282f2f435e70ec71e169d275743b40f8b4be14ecdbf",
    blockEpoch: 489210,
    targetRecord: mockTarget,
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    expectedRootHash: "7d793037a0760186574b0282f2f435e70ec71e169d275743b40f8b4be14ecdbf",
    blockEpoch: 489210,
    targetRecord: mockTarget,
    density: "comfortable",
  },
};
