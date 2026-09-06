import type { Meta, StoryObj } from "@storybook/react";
import { PermissionMatrixForm } from "./permission-matrix-form";

const meta: Meta<typeof PermissionMatrixForm> = {
  title: "Forms/PermissionMatrixForm",
  component: PermissionMatrixForm,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof PermissionMatrixForm>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <PermissionMatrixForm roles={['Admin', 'Editor', 'Viewer']} resources={['Users', 'Invoices', 'Reports', 'Settings']} permissions={{ Admin: { Users: true, Invoices: true, Reports: true, Settings: true }, Editor: { Users: false, Invoices: true, Reports: true, Settings: false }, Viewer: { Users: false, Invoices: false, Reports: true, Settings: false } }} />
    </div>
  ),
};
