import type { Meta, StoryObj } from "@storybook/react";
import { IdpLoginCard } from "./idp-login-card";

const meta: Meta<typeof IdpLoginCard> = {
  title: "Platforms/Identity/Auth/IdpLoginCard",
  component: IdpLoginCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof IdpLoginCard>;

export const Default: Story = {
  args: {
    tenantName: "Acme Industrial Corp",
    tenantSlug: "acme-corp",
    title: "Sign in with SSO",
    children: <div>Auth form inputs placeholder</div>,
  },
};
