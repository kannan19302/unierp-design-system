import type { Meta, StoryObj } from "@storybook/react";
import { FormFieldVisibilityEngine } from "./form-field-visibility-engine";

const meta: Meta<typeof FormFieldVisibilityEngine> = {
  title: "Core/Forms/FormFieldVisibilityEngine",
  component: FormFieldVisibilityEngine,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Declarative condition engine controlling dynamic field visibility based on peer field state and boolean rules.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormFieldVisibilityEngine>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <FormFieldVisibilityEngine
        fields={[
          { key: "paymentMethod" },
          { key: "bankRoutingNumber", visibleWhen: { field: "paymentMethod", equals: "wire" } },
          { key: "iban", visibleWhen: { field: "paymentMethod", equals: "sepa" } },
          { key: "cardNumber", visibleWhen: { field: "paymentMethod", equals: "card" } },
        ]}
        values={{ paymentMethod: "wire" }}
      >
        {(keys) => (
          <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-sm)" }}>
            <strong>Active Visible Form Fields:</strong> {keys.join(", ")}
          </div>
        )}
      </FormFieldVisibilityEngine>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: 600 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          1. Wire Transfer Mode
        </h4>
        <FormFieldVisibilityEngine
          fields={[
            { key: "method" },
            { key: "swiftCode", visibleWhen: { field: "method", equals: "wire" } },
          ]}
          values={{ method: "wire" }}
        >
          {(keys) => <div style={{ fontSize: "var(--text-xs)" }}>Visible: {keys.join(", ")}</div>}
        </FormFieldVisibilityEngine>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          2. Card Payment Mode
        </h4>
        <FormFieldVisibilityEngine
          fields={[
            { key: "method" },
            { key: "cardExp", visibleWhen: { field: "method", equals: "card" } },
          ]}
          values={{ method: "card" }}
        >
          {(keys) => <div style={{ fontSize: "var(--text-xs)" }}>Visible: {keys.join(", ")}</div>}
        </FormFieldVisibilityEngine>
      </div>
    </div>
  ),
};
