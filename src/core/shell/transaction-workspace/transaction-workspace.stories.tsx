import type { Meta, StoryObj } from "@storybook/react";
import { TransactionWorkspace } from "./transaction-workspace";
import { Button } from "../../primitives/button";

const meta: Meta<typeof TransactionWorkspace> = {
  title: "Core/Shell/Floorplans/TransactionWorkspace",
  component: TransactionWorkspace,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      element: "#storybook-root",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  argTypes: {
    action: { control: false },
    segments: { control: false },
    state: { control: false },
    headerFields: { control: false },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TransactionWorkspace>;

export const JournalEntry: Story = {
  args: {
    segments: [
      { label: "Acme Enterprise", href: "/" },
      { label: "Finance", href: "/finance" },
      { label: "General Ledger", href: "/finance/gl" },
      { label: "Manual Journals", href: "/finance/gl/journals" },
      { label: "JE-2026-089" },
    ],
    state: { label: "Draft", tone: "info" },
    action: { label: "Post Journal", onClick: () => alert("Posted") },
    title: "Journal Entry Voucher",
    documentNumber: "JE-2026-089",
    headerFields: (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)" }}>
        <div>
          <label style={{ fontSize: "var(--type-micro, 11px)", fontWeight: 600, textTransform: "uppercase", color: "var(--color-text-secondary)" }}>Posting Date</label>
          <div style={{ fontWeight: 500, marginTop: "var(--space-1)" }}>2026-09-02</div>
        </div>
        <div>
          <label style={{ fontSize: "var(--type-micro, 11px)", fontWeight: 600, textTransform: "uppercase", color: "var(--color-text-secondary)" }}>Legal Entity</label>
          <div style={{ fontWeight: 500, marginTop: "var(--space-1)" }}>Acme US Operations LLC</div>
        </div>
        <div>
          <label style={{ fontSize: "var(--type-micro, 11px)", fontWeight: 600, textTransform: "uppercase", color: "var(--color-text-secondary)" }}>Currency</label>
          <div style={{ fontWeight: 500, marginTop: "var(--space-1)" }}>USD ($)</div>
        </div>
        <div>
          <label style={{ fontSize: "var(--type-micro, 11px)", fontWeight: 600, textTransform: "uppercase", color: "var(--color-text-secondary)" }}>Reference Number</label>
          <div style={{ fontWeight: 500, marginTop: "var(--space-1)" }}>REF-99214-Q3</div>
        </div>
      </div>
    ),
    children: (
      <div style={{ padding: "var(--space-4)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
          <thead>
            <tr style={{ background: "var(--color-bg-sunken)", textAlign: "left" }}>
              <th style={{ padding: "var(--space-2)" }}>Account</th>
              <th style={{ padding: "var(--space-2)" }}>Description</th>
              <th style={{ padding: "var(--space-2)", textAlign: "right" }}>Debit ($)</th>
              <th style={{ padding: "var(--space-2)", textAlign: "right" }}>Credit ($)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td style={{ padding: "var(--space-2)" }}>1010 - Operating Checking</td>
              <td style={{ padding: "var(--space-2)" }}>Vendor settlement payment</td>
              <td style={{ padding: "var(--space-2)", textAlign: "right" }}>0.00</td>
              <td style={{ padding: "var(--space-2)", textAlign: "right" }}>45,000.00</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td style={{ padding: "var(--space-2)" }}>2010 - Accounts Payable</td>
              <td style={{ padding: "var(--space-2)" }}>Invoice clearing - Apex</td>
              <td style={{ padding: "var(--space-2)", textAlign: "right" }}>45,000.00</td>
              <td style={{ padding: "var(--space-2)", textAlign: "right" }}>0.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
    summaryItems: [
      { label: "Total Debits", value: "$45,000.00" },
      { label: "Total Credits", value: "$45,000.00" },
      { label: "Net Difference", value: "$0.00 (Balanced)", highlight: true },
    ],
    footerActions: (
      <>
        <Button variant="outline">Save Draft</Button>
        <Button variant="primary">Post & Approve</Button>
      </>
    ),
  },
};

export const AnatomyAndComposition: Story = {
  name: "Anatomy & Composition",
  args: {
    ...JournalEntry.args,
  },
};

export const AllStatesGallery: Story = {
  name: "All States Gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>Draft Voucher (Balanced)</h4>
        <TransactionWorkspace
          {...JournalEntry.args}
          title="Manual Journal Voucher"
          documentNumber="JE-2026-089"
          state={{ label: "Draft", tone: "info" }}
        />
      </div>

      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>Approved / Posted (Read Only)</h4>
        <TransactionWorkspace
          {...JournalEntry.args}
          title="Posted Invoice Clearing"
          documentNumber="JE-2026-042"
          state={{ label: "Posted", tone: "success" }}
          footerActions={
            <Button variant="outline">View Audit Trail</Button>
          }
        />
      </div>

      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>Unbalanced Alert State</h4>
        <TransactionWorkspace
          {...JournalEntry.args}
          title="Unbalanced Journal Voucher"
          documentNumber="JE-2026-090"
          state={{ label: "Unbalanced", tone: "critical" }}
          validationAlerts={
            <div style={{
              padding: "var(--space-2) var(--space-3)",
              background: "var(--color-status-danger-subtle, rgba(239, 68, 68, 0.1))",
              border: "1px solid var(--color-status-danger, #ef4444)",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-status-danger, #ef4444)",
              fontSize: "var(--text-xs)",
              fontWeight: 600,
            }}>
              Out of balance: Debits exceed credits by $1,250.00. Posting disabled.
            </div>
          }
          summaryItems={[
            { label: "Total Debits", value: "$46,250.00" },
            { label: "Total Credits", value: "$45,000.00" },
            { label: "Net Difference", value: "-$1,250.00 (Unbalanced)", highlight: true },
          ]}
          footerActions={
            <Button variant="outline" disabled>Post & Approve</Button>
          }
        />
      </div>
    </div>
  ),
};
