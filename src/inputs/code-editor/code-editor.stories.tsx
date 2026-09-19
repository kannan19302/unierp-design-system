import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CodeEditor } from "./code-editor";
import { MarkdownEditor } from "./markdown-editor";

/**
 * `CodeEditor` is a monospace multi-line editor with language indicator header,
 * ideal for JSON configurations, SQL query snippets, and schema definitions.
 *
 * ### Architectural Features
 * - **Code Typography**: Strictly binds to monospace font stacks.
 * - **Language Header**: Compact indicator chip for syntax context.
 * - **Clean Spellcheck State**: Disables browser red underlines on identifier names.
 */
const meta: Meta<typeof CodeEditor> = {
  title: "Inputs/CodeEditor",
  component: CodeEditor,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Monospace code and configuration editor with language tagging and disabled spellcheck.",
      },
    },
  },
  argTypes: {
    language: {
      control: "text",
      description: "Identifier for the programming or configuration language",
    },
    value: {
      control: "text",
      description: "Code text contents",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when editor is empty",
    },
    disabled: {
      control: "boolean",
      description: "Disables text area editing",
    },
    onChange: {
      action: "codeChanged",
      description: "Callback invoked with new code string",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeEditor>;

export const TypeScript: Story = {
  render: (args) => {
    const [code, setCode] = useState(args.value);
    return <CodeEditor {...args} value={code} onChange={setCode} />;
  },
  args: {
    language: "typescript",
    value: "export interface LedgerAccount {\n  id: string;\n  code: string;\n  name: string;\n  balance: number;\n}",
    disabled: false,
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

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", maxWidth: 500 }}>
      <div style={{ padding: "var(--space-md)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
        <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "bold", color: "var(--color-fg-muted)", marginBottom: "var(--space-xs)" }}>
          ANATOMY: LANGUAGE HEADER CHIP / MONOSPACE EDITING AREA
        </div>
        <CodeEditor
          language="sql"
          value="SELECT id, account_name, current_balance FROM accounts WHERE status = 'ACTIVE' LIMIT 100;"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)", maxWidth: 550 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          TypeScript Syntax
        </h4>
        <CodeEditor
          language="typescript"
          value="type Status = 'PENDING' | 'APPROVED' | 'POSTED';"
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          JSON Schema
        </h4>
        <CodeEditor
          language="json"
          value={'{\n  "version": "1.0.0",\n  "enabled": true\n}'}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Disabled State
        </h4>
        <CodeEditor
          language="yaml"
          value="pipeline:\n  stage: production\n  autoDeploy: false"
          disabled
        />
      </div>
    </div>
  ),
};
