import type { Meta, StoryObj } from "@storybook/react";
import { DocumentUploadForm } from "./document-upload-form";

const meta: Meta<typeof DocumentUploadForm> = {
  title: "Forms/DocumentUploadForm",
  component: DocumentUploadForm,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof DocumentUploadForm>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <DocumentUploadForm acceptedTypes={['PDF', 'PNG', 'JPG', 'XLSX']} />
    </div>
  ),
};
