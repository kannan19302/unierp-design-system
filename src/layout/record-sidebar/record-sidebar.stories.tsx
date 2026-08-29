import type { Meta, StoryObj } from "@storybook/react";
import { RecordSidebar } from "./record-sidebar";
import { DescriptionList } from "../../data-display/description-list";

const meta: Meta<typeof RecordSidebar> = {
  title: "Layout/RecordSidebar",
  component: RecordSidebar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RecordSidebar>;

export const Default: Story = {
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
  },
};
