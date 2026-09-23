import type { Meta, StoryObj } from "@storybook/react";
import { ProgressHUD } from "./progress-hud";

const meta: Meta<typeof ProgressHUD> = {
  title: "Core/Data Display/ProgressHUD",
  component: ProgressHUD,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ProgressHUD>;

export const InProgress: Story = {
  args: {
    percentComplete: 60,
    title: "Setup Checklist",
    items: [
      { key: "1", label: "Verify Company Details", isCompleted: true },
      { key: "2", label: "Add First Bank Account", isCompleted: true },
      { key: "3", label: "Invite Team Members", isCompleted: false, actionLabel: "Invite" },
      { key: "4", label: "Connect Payment Gateway", isCompleted: false, actionLabel: "Connect" },
    ],
  },
};

export const Complete: Story = {
  args: {
    percentComplete: 100,
    title: "Setup Complete",
    items: [
      { key: "1", label: "Verify Company Details", isCompleted: true },
      { key: "2", label: "Add First Bank Account", isCompleted: true },
    ],
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <ProgressHUD
        percentComplete={60}
        title="Setup Checklist"
        items={[
          { key: "1", label: "Verify Company Details", isCompleted: true },
          { key: "2", label: "Add First Bank Account", isCompleted: true },
          { key: "3", label: "Invite Team Members", isCompleted: false, actionLabel: "Invite" },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h3 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-fg-muted)" }}>In Progress State</h3>
        <ProgressHUD
          percentComplete={45}
          title="Setup Checklist"
          items={[
            { key: "1", label: "Create Profile", isCompleted: true },
            { key: "2", label: "Configure Billing", isCompleted: false, actionLabel: "Setup" },
          ]}
        />
      </div>
      <div>
        <h3 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-fg-muted)" }}>100% Complete State</h3>
        <ProgressHUD
          percentComplete={100}
          title="Onboarding Finished"
          items={[
            { key: "1", label: "Create Profile", isCompleted: true },
            { key: "2", label: "Configure Billing", isCompleted: true },
          ]}
        />
      </div>
    </div>
  ),
};

