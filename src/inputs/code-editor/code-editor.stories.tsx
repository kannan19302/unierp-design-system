import type { Meta, StoryObj } from "@storybook/react";
import { CodeEditor } from "./code-editor";
import { MarkdownEditor } from "./markdown-editor";

const meta: Meta<typeof CodeEditor> = {
  title: "Inputs/CodeEditor",
  component: CodeEditor,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CodeEditor>;

export const TypeScript: Story = {
  args: {
    language: "typescript",
    value: "export interface LedgerAccount {\n  id: string;\n  code: string;\n  name: string;\n  balance: number;\n}",
  },
};

export const JSONConfig: Story = {
  args: {
    language: "json",
    value: '{\n  "tenantId": "org_9812",\n  "fiscalStartMonth": 4,\n  "currency": "EUR"\n}',
  },
};

export const Markdown = () => (
  <MarkdownEditor value="# Audit Trail Report\n\n- Verified by: `Kannan`\n- Status: **Approved**" />
);
