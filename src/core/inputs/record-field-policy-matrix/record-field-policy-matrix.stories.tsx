import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  RecordFieldPolicyMatrix,
  type FieldPermissionLevel,
  type MatrixField,
  type MatrixRole,
} from "./record-field-policy-matrix";

const meta: Meta<typeof RecordFieldPolicyMatrix> = {
  title: "Inputs/RecordFieldPolicyMatrix",
  component: RecordFieldPolicyMatrix,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof RecordFieldPolicyMatrix>;

const SAMPLE_FIELDS: MatrixField[] = [
  { id: "tax_id", name: "tax_id", type: "string", isPii: true },
  { id: "bank_account", name: "bank_account_num", type: "string", isPii: true },
  { id: "legal_name", name: "legal_entity_name", type: "string", isPii: false },
  { id: "annual_revenue", name: "annual_revenue", type: "decimal", isPii: false },
  { id: "credit_rating", name: "credit_score", type: "int", isPii: false },
];

const SAMPLE_ROLES: MatrixRole[] = [
  { id: "super_admin", name: "Super Admin" },
  { id: "finance_mgr", name: "Finance Manager" },
  { id: "procurement", name: "Procurement Agent" },
  { id: "auditor", name: "External Auditor" },
];

const MatrixInteractiveDemo = () => {
  const [matrix, setMatrix] = useState<Record<string, Record<string, FieldPermissionLevel>>>({
    tax_id: {
      super_admin: "READ_WRITE",
      finance_mgr: "READ_ONLY",
      procurement: "MASKED",
      auditor: "MASKED",
    },
    bank_account: {
      super_admin: "READ_WRITE",
      finance_mgr: "READ_ONLY",
      procurement: "NO_ACCESS",
      auditor: "MASKED",
    },
    legal_name: {
      super_admin: "READ_WRITE",
      finance_mgr: "READ_WRITE",
      procurement: "READ_WRITE",
      auditor: "READ_ONLY",
    },
    annual_revenue: {
      super_admin: "READ_WRITE",
      finance_mgr: "READ_WRITE",
      procurement: "READ_ONLY",
      auditor: "READ_ONLY",
    },
    credit_rating: {
      super_admin: "READ_WRITE",
      finance_mgr: "READ_WRITE",
      procurement: "READ_ONLY",
      auditor: "READ_ONLY",
    },
  });

  const handleChange = (fieldId: string, roleId: string, level: FieldPermissionLevel) => {
    setMatrix((prev) => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        [roleId]: level,
      },
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-1) 0" }}>Vendor Entity: Field Level Security (FLS)</h4>
        <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
          Strict column-level granular permissions controlling Read, Write, Masking, and Denied projection.
        </p>
      </div>

      <RecordFieldPolicyMatrix
        fields={SAMPLE_FIELDS}
        roles={SAMPLE_ROLES}
        matrix={matrix}
        onChangePermission={handleChange}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <MatrixInteractiveDemo />,
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        <strong>RecordFieldPolicyMatrix Anatomy:</strong>
        <ol style={{ margin: "var(--space-2) 0", paddingInlineStart: "var(--space-4)" }}>
          <li>Sticky First Column (Entity Field identifier + PII security tag + data type)</li>
          <li>Role Headers (Enterprise roles as column axis)</li>
          <li>Interactive Permission Dropdown / Pill (Read/Write, Read Only, Masked, No Access)</li>
          <li>Color-coded access tiers for instantaneous visual auditing</li>
        </ol>
      </div>
      <MatrixInteractiveDemo />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => <MatrixInteractiveDemo />,
};
