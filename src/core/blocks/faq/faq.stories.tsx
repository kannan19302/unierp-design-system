import type { Meta, StoryObj } from "@storybook/react";
import { FaqBlock } from "./faq";

const meta: Meta<typeof FaqBlock> = {
  title: "Blocks/FaqBlock",
  component: FaqBlock,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof FaqBlock>;

export const Default: Story = {
  args: {
    title: "Frequently Asked Questions",
    faqs: [
      {
        question: "Can UniERP integrate with custom ERP systems?",
        answer: "Yes, UniERP provides REST and gRPC connectors along with an OpenAPI standard spec.",
      },
      {
        question: "Is multi-tenant isolation guaranteed?",
        answer: "Every tenant is scoped by Tenant ID with automated schema isolation and KMS key rotation.",
      },
    ],
  },
};
