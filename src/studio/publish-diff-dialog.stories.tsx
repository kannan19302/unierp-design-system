import type { Meta, StoryObj } from "@storybook/react";
import { PublishDiffDialog } from "./publish-diff-dialog";

/**
 * This dialog is a policy, not a convenience — UI_UX_BRIEF §12 rule 4. Every
 * publish path in the Developer Platform goes through it, including the ones an
 * AI copilot triggers, which is how Track G's G29 ("no AI output reaches a
 * tenant's data without an explicit accept") is enforced rather than promised.
 */
const meta: Meta<typeof PublishDiffDialog> = {
  title: "Studio/PublishDiffDialog",
  component: PublishDiffDialog,
  parameters: { layout: "centered" },
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
