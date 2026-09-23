import type { Meta, StoryObj } from "@storybook/react";
import { TextField, Input, Textarea, Select, FormField, FormSection, AutosaveIndicator } from "./form-control";
import { Search, Mail, Lock, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * ## FormControl & Input Primitives
 *
 * Authoritative form architecture for Strata DL 2.0. Enforces accessible field bindings,
 * floating or stacked labels, hint messages, validation state indicators, and responsive input slots.
 *
 * ### Key Capabilities
 * - **Accessible Bindings**: Automatic `htmlFor` and `id` linking via `React.useId()`.
 * - **Slot Integration**: Prefix and suffix icon slots for contextual search and currency.
 * - **Collapsible Sections**: Structured group containers with optional toggle mechanics.
 * - **Autosave Live Region**: Screen-reader polite persistence feedback indicators.
 */
const meta: Meta<typeof TextField> = {
  title: "Core/Inputs/FormControl",
  component: TextField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise form control primitives supporting accessible text fields, textareas, native selects, prefix/suffix icons, collapsible form sections, and auto-save indicators.",
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Visual label text associated with the form field.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text rendered when the field is empty.",
    },
    error: {
      control: "text",
      description: "Error message displayed below the field. Triggers aria-invalid.",
    },
    hint: {
      control: "text",
      description: "Assistive hint text displayed below the field when error is absent.",
    },
    required: {
      control: "boolean",
      description: "Renders an accessible required asterisk and marks input required.",
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction and applies muted opacity styling.",
    },
    readOnly: {
      control: "boolean",
      description: "Renders the control in a non-editable, read-only state.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    label: "Company Name",
    placeholder: "Acme Industrial Corp",
    hint: "Enter registered legal legal entity name.",
  },
};

export const WithError: Story = {
  args: {
    label: "Tax Identification Number",
    placeholder: "XX-XXXXXXX",
    defaultValue: "123",
    error: "TIN must contain at least 9 alphanumeric digits.",
    required: true,
  },
};

/**
 * Exploded sub-component anatomy detailing FormField slots, Input prefix/suffix, Select, and FormSection.
 */
export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "540px" }}>
    <FormSection title="Account Authentication" description="Configure core identity credentials and access control.">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <FormField label="Work Email Address" htmlFor="demo-email" required hint="Used for single sign-on and notifications.">
          <Input
            id="demo-email"
            type="email"
            placeholder="operator@acme.com"
            prefixIcon={<Mail size={14} style={{ color: "var(--color-text-muted)" }} />}
          />
        </FormField>

        <FormField label="Security Key / Token" htmlFor="demo-token" required>
          <Input
            id="demo-token"
            type="password"
            placeholder="Enter personal access secret"
            prefixIcon={<Lock size={14} style={{ color: "var(--color-text-muted)" }} />}
            suffixIcon={<CheckCircle2 size={14} style={{ color: "var(--color-success)" }} />}
          />
        </FormField>

        <FormField label="Organization Region" htmlFor="demo-region" required>
          <Select id="demo-region" defaultValue="us-east-1">
            <option value="us-east-1">US East (N. Virginia)</option>
            <option value="eu-west-1">EU West (Ireland)</option>
            <option value="ap-southeast-1">AP Southeast (Singapore)</option>
          </Select>
        </FormField>

        <FormField label="Audit Log Notes" htmlFor="demo-notes">
          <Textarea id="demo-notes" placeholder="Enter optional justification for credential update..." rows={3} />
        </FormField>
      </div>
    </FormSection>

    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <AutosaveIndicator status="saved" />
    </div>
  </div>
);

/**
 * All States Gallery rendering all lifecycle, interaction, and validation states.
 */
export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "600px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Standard Lifecycle States
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        <TextField label="Default (Empty)" placeholder="Enter legal name..." />
        <TextField label="Value Populated" defaultValue="Acme Global Industries" />
        <TextField label="Disabled" defaultValue="Locked Enterprise Setting" disabled />
        <TextField label="Read Only" defaultValue="CONFIDENTIAL-RECORD-1049" readOnly />
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Validation & Feedback States
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        <TextField
          label="Invalid / Error"
          defaultValue="invalid-format"
          error="Please provide a valid ISO currency code."
          required
        />
        <FormField label="Prefix Search Slot" htmlFor="state-search">
          <Input
            id="state-search"
            placeholder="Search general ledger..."
            prefixIcon={<Search size={14} style={{ color: "var(--color-text-muted)" }} />}
          />
        </FormField>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Autosave Feedback States
      </h4>
      <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
        <AutosaveIndicator status="saving" />
        <AutosaveIndicator status="saved" />
        <AutosaveIndicator status="error" />
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        4-Tier Ergonomic Density Matrix
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <TextField label="Ultra-Compact (24px) Ledger Field" defaultValue="GL-10492-BAL" />
        </div>
        <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <TextField label="Compact (28px) Operational Field" defaultValue="Standard Line Item Note" />
        </div>
        <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <TextField label="Standard (32px) Default Field" defaultValue="Corporate Account Holder" />
        </div>
        <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <TextField label="Comfortable (40px) Touch / POS Field" defaultValue="Retail Cashier Register 01" />
        </div>
      </div>
    </div>
  </div>
);
