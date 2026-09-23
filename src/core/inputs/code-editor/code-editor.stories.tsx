import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CodeEditor } from "./code-editor";
import { MarkdownEditor } from "./markdown-editor";

/**
 * `CodeEditor` is a monospace multi-line editor with language indicator header, line numbers,
 * copy button, 4-tier density scaling, and disabled spellcheck. Ideal for JSON configurations,
 * SQL query snippets, and schema definitions.
 *
 * ### Architectural Features
 * - **Code Typography**: Strictly binds to monospace font stacks.
 * - **Language Header & Copy Action**: Compact indicator chip with one-click clipboard copying.
 * - **Line Numbers & 4-Tier Density**: Optional line gutter and scaling from ultra-compact (72px) to comfortable (220px).
 * - **Clean Spellcheck State**: Disables browser red underlines on identifier names.
 */
const meta: Meta<typeof CodeEditor> = {
  title: "Core/Inputs/CodeEditor",
  component: CodeEditor,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Monospace code and configuration editor with language tagging, line numbers, copy button, and density scaling.",
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
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "4-tier density scaling",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when editor is empty",
    },
    disabled: {
      control: "boolean",
      description: "Disables text area editing",
    },
    showLineNumbers: {
      control: "boolean",
      description: "Toggles line number gutter",
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
    label: "TypeScript Interface Definition",
    value: "export interface LedgerAccount {\n  id: string;\n  code: string;\n  name: string;\n  balance: number;\n}",
    showLineNumbers: true,
    disabled: false,
  },
};

export const JSONConfig: Story = {
  args: {
    language: "json",
    label: "Tenant Accounting Configuration",
    value: '{\n  "tenantId": "org_9812",\n  "fiscalStartMonth": 4,\n  "currency": "EUR"\n}',
    showLineNumbers: true,
  },
};

export const DensityTiers: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 500 }}>
      <CodeEditor density="ultra-compact" language="sql" value="SELECT * FROM ledgers;" label="Ultra-compact (72px)" />
      <CodeEditor density="compact" language="json" value='{\n  "status": "OK"\n}' label="Compact (100px)" />
      <CodeEditor density="standard" language="typescript" value="const taxRate = 0.18;" label="Standard (140px)" />
      <CodeEditor density="comfortable" language="python" value="def reconcile():\n    pass" label="Comfortable (220px)" />
    </div>
  ),
};

export const MarkdownStory: Story = {
  name: "Markdown Editor",
  render: () => {
    const [content, setContent] = useState(
      "# Audit Trail Report\n\n- Verified by: `Kannan`\n- Status: **Approved**\n\nAll ledger accounts balance to zero tolerance.",
    );
    return (
      <div style={{ maxWidth: 550 }}>
        <MarkdownEditor
          label="Release Notes & Documentation"
          description="Use Markdown syntax to document system changes. Switch between Write and Preview tabs."
          value={content}
          onChange={setContent}
        />
      </div>
    );
  },
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Default with Line Numbers</h4>
        <CodeEditor
          language="sql"
          value="SELECT count(*) FROM journals;"
          showLineNumbers
          label="SQL Query"
        />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Error State</h4>
        <CodeEditor
          language="json"
          value='{\n  "invalidJson": \n}'
          invalid
          error="Syntax error: Unexpected token at line 3"
          label="JSON Schema"
        />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Disabled State</h4>
        <CodeEditor
          language="yaml"
          value="readOnly: true\ncluster: prod-eu-1"
          disabled
          label="Read-only Deployment Spec"
        />
      </div>
    </div>
  ),
};

export const V1WorkspacePreview: Story = {
  render: () => (
    <div style={{ padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-lg)", maxWidth: 650 }}>
      <div style={{ marginBottom: "var(--space-3)", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-2)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--font-size-md)", fontWeight: "var(--weight-semibold)" }}>Workflow Automation Script</h3>
        <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          Configure post-settlement webhook payload transformers in TypeScript.
        </p>
      </div>
      <CodeEditor
        label="Event Transform Handler"
        language="typescript"
        showLineNumbers
        value={`export async function onInvoiceApproved(event: InvoiceEvent): Promise<JournalEntry> {
  return {
    reference: event.invoiceNumber,
    amount: event.totalAmount,
    currency: event.currency,
    postedAt: new Date(),
  };
}`}
      />
    </div>
  ),
};
