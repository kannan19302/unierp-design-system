import type { Meta, StoryObj } from "@storybook/react";
import { PublishDiffDialog } from "./publish-diff-dialog";

/**
 * This dialog is a policy, not a convenience — UI_UX_BRIEF §12 rule 4. Every
 * publish path in the Developer Platform goes through it, including the ones an
 * AI copilot triggers, which is how Track G's G29 ("no AI output reaches a
 * tenant's data without an explicit accept") is enforced rather than promised.
 */
const meta: Meta<typeof PublishDiffDialog> = {
  title: "Core/Studio/PublishDiffDialog",
  component: PublishDiffDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof PublishDiffDialog>;

export const Default: Story = {
  args: {
    open: true,
    name: "Contact form",
    environment: "production",
    rollbackTo: "v11",
    onClose: () => {},
    onPublish: () => {},
    changes: [
      { id: "a", kind: "added", what: "Phone field" },
      {
        id: "b",
        kind: "changed",
        what: "Email field",
        detail: "required: false → true",
      },
      { id: "c", kind: "removed", what: "Fax field" },
    ],
  },
};

/** A publish that would change nothing is refused, not allowed as a no-op. */
export const NothingToPublish: Story = {
  args: {
    ...Default.args,
    changes: [],
  },
};

/** Publishing in flight — the button holds its own spinner and Cancel locks. */
export const Publishing: Story = {
  args: {
    ...Default.args,
    publishing: true,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ position: "relative", minHeight: "500px", width: "100%" }}>
      <PublishDiffDialog
        open={true}
        name="Billing Workflow Schema"
        environment="staging-eu-west-1"
        rollbackTo="v2.4.1"
        onClose={() => {}}
        onPublish={() => {}}
        changes={[
          { id: "c1", kind: "added", what: "SEPA Direct Debit Gateway Handler", detail: "Added automated mandate verification" },
          { id: "c2", kind: "changed", what: "Currency Precision", detail: "Default: 2 decimals → 4 decimals for FX trades" },
          { id: "c3", kind: "removed", what: "Legacy Wire Protocol v1" },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div style={{ position: "relative", minHeight: "450px" }}>
        <PublishDiffDialog
          open={true}
          name="Payment Model"
          environment="production"
          rollbackTo="v4.0"
          onClose={() => {}}
          onPublish={() => {}}
          changes={[
            { id: "1", kind: "added", what: "Tax Identifier Validation" },
            { id: "2", kind: "changed", what: "Stripe API Webhook Signature" },
          ]}
        />
      </div>
    </div>
  ),
};
