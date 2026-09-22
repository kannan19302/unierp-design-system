import type { Meta, StoryObj } from "@storybook/react";
import { RegistrationFlow } from "./registration-flow";

const meta: Meta<typeof RegistrationFlow> = {
  title: "Blocks/RegistrationFlow",
  component: RegistrationFlow,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof RegistrationFlow>;

export const Step1Account: Story = {
  name: "REG-001 Step 1 — Account & Org Setup",
  args: {
    step: 1,
    initialEmail: "alex.chen@innovate-corp.com",
    initialName: "Alex Chen",
    initialOrgName: "Innovate Corporation",
    initialSubdomain: "innovate",
    initialRegion: "eu-central-1",
  },
};

export const Step2VerifyOtp: Story = {
  name: "REG-002 Step 2 — Verify Email OTP",
  args: {
    step: 2,
    initialEmail: "alex.chen@innovate-corp.com",
  },
};

export const Step3Provisioning: Story = {
  name: "REG-003 Step 3 — Sovereign Provisioning Engine",
  args: {
    step: 3,
    provisioningProgress: 78,
  },
};

export const Step3ProvisioningComplete: Story = {
  name: "REG-003 Step 3 — Provisioning Complete (100%)",
  args: {
    step: 3,
    provisioningProgress: 100,
  },
};

export const Step4DomainCollision: Story = {
  name: "REG-004 Step 4 — Domain Collision & SSO Redirection",
  args: {
    step: 4,
    collisionDomain: "acmeglobal.com",
    collisionOrgName: "Acme Global Enterprise",
    collisionIdpName: "Okta Enterprise SSO",
  },
};
