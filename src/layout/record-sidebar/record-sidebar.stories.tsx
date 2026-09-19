import type { Meta, StoryObj } from "@storybook/react";
import { RecordSidebar } from "./record-sidebar";
import { DescriptionList } from "../../data-display/description-list";
import { Button } from "../../primitives/button";

const meta: Meta<typeof RecordSidebar> = {
  title: "Layout/RecordSidebar",
  component: RecordSidebar,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RecordSidebar>;

export const AnatomyAndComposition: Story = {
  render: (args) => <RecordSidebar {...args} />,
  args: {
    title: "Voucher Metadata",
    children: (
      <DescriptionList
        items={[
          { label: "Status", value: "Posted" },
          { label: "Created By", value: "Elena R." },
          { label: "Posting Date", value: "2026-08-29" },
          { label: "Checksum", value: "sha256:4f89...1a2b" },
        ]}
      />
    ),
    footer: <Button size="sm" variant="outline" style={{ inlineSize: "100%" }}>View Raw Audit Log</Button>,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", padding: "16px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0", color: "var(--color-text-primary)" }}>With Footer Action</h4>
        <RecordSidebar
          title="Account Details"
          footer={<Button size="sm" style={{ inlineSize: "100%" }}>Edit Account</Button>}
        >
          <DescriptionList
            items={[
              { label: "Currency", value: "USD" },
              { label: "Type", value: "Enterprise Asset" },
            ]}
          />
        </RecordSidebar>
      </div>

      <div>
        <h4 style={{ margin: "0 0 8px 0", color: "var(--color-text-primary)" }}>Without Footer</h4>
        <RecordSidebar title="Simple Metadata">
          <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
            Read-only immutable transaction log metadata.
          </p>
        </RecordSidebar>
      </div>
    </div>
  ),
};

export const Default: Story = {
  ...AnatomyAndComposition,
};

