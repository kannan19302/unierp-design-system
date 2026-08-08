import type { Meta, StoryObj } from "@storybook/react";
import { ProtectedComponent } from "./protected-component";

const meta: Meta = {
  title: "Components/ProtectedComponent",
};

export default meta;

export const Allowed: StoryObj = {
  render: () => (
    <ProtectedComponent permission="finance:write" userPermissions={["finance:write"]}>
      <button style={{ padding: "8px 16px" }}>Approve Payment</button>
    </ProtectedComponent>
  ),
};

export const Denied: StoryObj = {
  render: () => (
    <ProtectedComponent permission="finance:write" userPermissions={["finance:read"]}>
      <button style={{ padding: "8px 16px" }}>Approve Payment</button>
    </ProtectedComponent>
  ),
};
