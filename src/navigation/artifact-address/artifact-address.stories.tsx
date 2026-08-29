import type { Meta, StoryObj } from "@storybook/react";
import { ArtifactAddress } from "./artifact-address";

const meta: Meta<typeof ArtifactAddress> = {
  title: "Navigation/ArtifactAddress",
  component: ArtifactAddress,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ArtifactAddress>;

export const AppArtifact: Story = {
  args: {
    tenant: "acme",
    scope: "app",
    project: "hr-core",
    builder: "forms",
    artifact: "leave-request",
    version: "v2.1",
    copyable: true,
  },
};

export const LibraryArtifact: Story = {
  args: {
    tenant: "acme",
    scope: "library",
    project: null,
    builder: "workflows",
    artifact: "two-man-approval",
    copyable: true,
  },
};
