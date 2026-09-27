import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FileUpload, type UploadFileItem } from "./file-upload";

/**
 * `FileUpload` is an enterprise drag-and-drop file staging area designed for ERP workflows.
 * Supports keyboard activation (Enter/Space), 4-tier density, visual drag states,
 * custom MIME filters, and real-time progress/staging queue indicators.
 *
 * ### Architectural Features
 * - **WAI-ARIA Pattern**: `role="button"` with `aria-disabled`, `aria-invalid`, and hidden native input activation.
 * - **Keyboard Trigger**: Full Space and Enter keybinding mapped directly to file selection dialog.
 * - **4-Tier Density**: Ultra-compact, Compact, Standard, and Comfortable sizing.
 * - **Staging Queue**: File queue list with progress bars, file sizes, error states, and removal triggers.
 */
const meta: Meta<typeof FileUpload> = {
  title: "Core/Inputs/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "High-capacity drag-and-drop dropzone supporting bulk file ingestion, density scaling, and file selection with externally supplied progress tracking.",
      },
    },
  },
  argTypes: {
    accept: {
      control: "text",
      description: "Comma-separated list of allowed file extensions or MIME types",
    },
    multiple: {
      control: "boolean",
      description: "Permits selection of multiple files concurrently",
    },
    disabled: {
      control: "boolean",
      description: "Disables drag events and file dialog triggers",
    },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "4-tier density scaling",
    },
    onFileSelect: {
      action: "filesSelected",
      description: "Callback invoked when files are dropped or selected",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: {
    label: "Attachment Documents",
    accept: ".csv,.xlsx,.pdf",
    multiple: true,
    disabled: false,
  },
};

export const DensityTiers: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 500 }}>
      <FileUpload density="ultra-compact" label="Ultra-compact (24px inline style)" accept=".csv" />
      <FileUpload density="compact" label="Compact Dropzone" accept=".pdf" />
      <FileUpload density="standard" label="Standard Dropzone" accept=".pdf,.docx" />
      <FileUpload density="comfortable" label="Comfortable High-Capacity Dropzone" accept=".zip,.tar.gz" />
    </div>
  ),
};

export const WithFileQueue: Story = {
  render: () => {
    const [fileList, setFileList] = useState<UploadFileItem[]>([
      { id: "1", name: "Q3_Financial_Statement.xlsx", size: 1024 * 340, status: "done" },
      { id: "2", name: "Audit_Evidence_Archive.zip", size: 1024 * 1024 * 12.4, status: "uploading", progress: 68 },
      { id: "3", name: "Damaged_Invoice_Scan.png", size: 1024 * 85, status: "error", error: "File integrity check failed" },
    ]);

    return (
      <div style={{ maxWidth: 520 }}>
        <FileUpload
          label="Financial Audit Evidence"
          description="Upload supporting invoices, ledger extracts, and bank statements."
          files={fileList}
          onFileRemove={(idx) => setFileList((prev) => prev.filter((_, i) => i !== idx))}
        />
      </div>
    );
  },
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Default Idle</h4>
        <FileUpload label="Tax Filings" accept=".pdf" />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Error State</h4>
        <FileUpload label="Legal Certification" accept=".pdf" invalid error="File size exceeds enterprise quota of 25MB" />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Disabled</h4>
        <FileUpload label="Archived Documents" disabled />
      </div>
    </div>
  ),
};

export const V1WorkspacePreview: Story = {
  render: () => (
    <div style={{ padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-lg)", maxWidth: 600 }}>
      <div style={{ marginBottom: "var(--space-3)", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-2)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--font-size-md)", fontWeight: "var(--weight-semibold)" }}>Bulk Invoice Staging Area</h3>
        <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          Drag EDI or PDF invoices to start autonomous optical recognition and ledger line ingestion.
        </p>
      </div>
      <FileUpload
        label="Batch Import Files"
        accept=".pdf,.xml,.csv"
        multiple
        files={[
          { name: "Vendor_Invoice_ACME_8492.pdf", size: 1024 * 420, status: "done" },
          { name: "Batch_Payroll_Receipts.csv", size: 1024 * 1280, status: "uploading", progress: 42 },
        ]}
      />
    </div>
  ),
};
