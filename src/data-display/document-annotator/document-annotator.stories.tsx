import type { Meta, StoryObj } from "@storybook/react";
import { DocumentAnnotator, type DocumentStamp, type DocumentAnnotation } from "./document-annotator";

const sampleStamps: DocumentStamp[] = [
  {
    id: "s1",
    type: "APPROVED",
    signee: "CFO Eleanor Vance",
    timestamp: "2026-08-28 16:45 UTC",
    x: 420,
    y: 180,
  },
  {
    id: "s2",
    type: "AUDITED",
    signee: "KPMG External Audit",
    timestamp: "2026-08-29 09:12 UTC",
    x: 440,
    y: 280,
  },
];

const sampleAnnotations: DocumentAnnotation[] = [
  {
    id: "a1",
    author: "Tax Compliance",
    text: "Verify VAT reverse-charge clause in Section 4.2.",
    x: 20,
    y: 220,
  },
];

const meta: Meta<typeof DocumentAnnotator> = {
  title: "DataDisplay/DocumentAnnotator",
  component: DocumentAnnotator,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof DocumentAnnotator>;

export const InvoiceWithStamps: Story = {
  render: () => (
    <DocumentAnnotator
      title="Commercial Tax Invoice"
      documentNumber="INV-2026-8831"
      stamps={sampleStamps}
      annotations={sampleAnnotations}
      onAddStamp={(type) => alert(`Added ${type} stamp`)}
      onAddAnnotation={(text) => alert(`Added annotation: ${text}`)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #0f172a", paddingBottom: "var(--space-4)", marginBottom: "var(--space-6)" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "var(--text-xl)", fontWeight: 800 }}>GLOBAL LOGISTICS CORP</h2>
          <p style={{ margin: "4px 0 0", fontSize: "var(--text-xs)", color: "#64748b" }}>Tax ID: US-994820194 • ISO-9001 Certified</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, fontSize: "var(--text-base)" }}>INVOICE: INV-2026-8831</div>
          <div style={{ fontSize: "var(--text-xs)", color: "#64748b" }}>Date: August 28, 2026</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)", marginBottom: "var(--space-6)", fontSize: "var(--text-xs)" }}>
        <div>
          <strong>Billed To:</strong>
          <p style={{ margin: "4px 0 0", color: "#334155" }}>Acme Global Holdings Inc.<br />100 Enterprise Way, Suite 400<br />San Francisco, CA 94105</p>
        </div>
        <div>
          <strong>Payment Terms:</strong>
          <p style={{ margin: "4px 0 0", color: "#334155" }}>Net 30 Days<br />Due Date: September 27, 2026<br />Currency: USD ($)</p>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)", marginBottom: "var(--space-6)" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #cbd5e1", textAlign: "left" }}>
            <th style={{ padding: "8px 0" }}>Description</th>
            <th style={{ padding: "8px 0", textAlign: "center" }}>Qty</th>
            <th style={{ padding: "8px 0", textAlign: "right" }}>Rate</th>
            <th style={{ padding: "8px 0", textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
            <td style={{ padding: "8px 0" }}>Enterprise Cloud Hosting - Q3 Dedicated Instance</td>
            <td style={{ padding: "8px 0", textAlign: "center" }}>3</td>
            <td style={{ padding: "8px 0", textAlign: "right" }}>$4,500.00</td>
            <td style={{ padding: "8px 0", textAlign: "right" }}>$13,500.00</td>
          </tr>
          <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
            <td style={{ padding: "8px 0" }}>24/7 Priority SRE Support Retainer</td>
            <td style={{ padding: "8px 0", textAlign: "center" }}>1</td>
            <td style={{ padding: "8px 0", textAlign: "right" }}>$2,500.00</td>
            <td style={{ padding: "8px 0", textAlign: "right" }}>$2,500.00</td>
          </tr>
        </tbody>
        <tfoot>
          <tr style={{ borderTop: "2px solid #0f172a", fontWeight: 700 }}>
            <td colSpan={3} style={{ padding: "10px 0", textAlign: "right" }}>Total Payable:</td>
            <td style={{ padding: "10px 0", textAlign: "right", fontSize: "var(--text-sm)" }}>$16,000.00</td>
          </tr>
        </tfoot>
      </table>
    </DocumentAnnotator>
  ),
};
