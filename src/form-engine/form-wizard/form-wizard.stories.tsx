import type { Meta, StoryObj } from "@storybook/react";
import { FormWizard, type WizardStep } from "./form-wizard";

const sampleSteps: WizardStep[] = [
  {
    id: "step-1",
    title: "Organization Profile",
    subtitle: "Legal entity and registration numbers",
    component: (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 500 }}>
        <div>
          <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>
            Company Legal Name
          </label>
          <input
            type="text"
            defaultValue="Acme Global Inc."
            style={{ width: "100%", height: 36, padding: "0 8px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>
            Tax Identification Number (TIN)
          </label>
          <input
            type="text"
            defaultValue="US-994820194"
            style={{ width: "100%", height: 36, padding: "0 8px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}
          />
        </div>
      </div>
    ),
  },
  {
    id: "step-2",
    title: "Chart of Accounts",
    subtitle: "Select standard accounting model",
    component: (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", maxWidth: 500 }}>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Choose your fiscal accounting structure:
        </p>
        <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "var(--space-2)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
          <input type="radio" name="coa" defaultChecked />
          <span>US GAAP Standard (Manufacturing & Services)</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "var(--space-2)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
          <input type="radio" name="coa" />
          <span>IFRS Enterprise Framework</span>
        </label>
      </div>
    ),
  },
  {
    id: "step-3",
    title: "Review & Deploy",
    subtitle: "Verify settings before provisioning tenant partition",
    component: (
      <div style={{ padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-sm)", maxWidth: 500 }}>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)" }}>Ready to Provision</h4>
        <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          {'Clicking "Complete Setup" will create your tenant database partition, apply PostgreSQL RLS policies, and generate root administrator credentials.'}
        </p>
      </div>
    ),
  },
];

const meta: Meta<typeof FormWizard> = {
  title: "FormEngine/FormWizard",
  component: FormWizard,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof FormWizard>;

export const TenantOnboardingWizard: Story = {
  args: {
    title: "Tenant ERP Organization Setup",
    subtitle: "Configure corporate profile and fiscal defaults in 3 easy steps",
    steps: sampleSteps,
    submitLabel: "Deploy Organization Partition",
  },
};
