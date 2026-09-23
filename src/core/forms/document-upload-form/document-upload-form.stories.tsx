import type { Meta, StoryObj } from "@storybook/react";
import { DocumentUploadForm } from "./document-upload-form";

const meta: Meta<typeof DocumentUploadForm> = {
  title: "Core/Forms/DocumentUploadForm",
  component: DocumentUploadForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "button-name", enabled: true }],
      },
    },
  },
  argTypes: {
    acceptedTypes: {
      description: "List of allowed file extensions / MIME types",
    },
    maxFiles: {
      control: "number",
      description: "Maximum allowable files uploaded",
    },
    title: {
      control: "text",
      description: "Upload form card title",
    },
    subtitle: {
      control: "text",
      description: "Supplementary instructions",
    },
    onUpload: {
      action: "filesUploaded",
      description: "Callback invoked when files are staged",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DocumentUploadForm>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "36rem", padding: "var(--space-4)" }}>
      <DocumentUploadForm
        acceptedTypes={["PDF", "PNG", "JPG", "XLSX"]}
        title="Vendor Invoices & Supporting Vouchers"
        subtitle="Attach PDF scans or Excel spreadsheets for automatic OCR parsing."
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "36rem", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h4>Anatomy and Composition</h4>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
        DocumentUploadForm encapsulates accessible drag-and-drop targets, file browse dialogs,
        staged asset list rendering, and removal handlers.
      </p>
      <DocumentUploadForm
        acceptedTypes={["PDF", "DOCX"]}
        initialFileNames={["Master_Service_Agreement_Signed.pdf"]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "38rem", display: "flex", flexDirection: "column", gap: "var(--space-8)", padding: "var(--space-4)" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Empty Staging State</h5>
        <DocumentUploadForm
          acceptedTypes={["CSV", "TSV"]}
          title="Bank Statement Import"
          maxFiles={1}
        />
      </div>

      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Multiple Staged Documents</h5>
        <DocumentUploadForm
          acceptedTypes={["PDF", "PNG", "JPG"]}
          title="Employee Identity Verification"
          initialFileNames={[
            "Passport_Scan_Front.pdf",
            "Proof_Of_Address_Utility.pdf",
            "Tax_Exemption_Form_2026.png",
          ]}
        />
      </div>
    </div>
  ),
};
