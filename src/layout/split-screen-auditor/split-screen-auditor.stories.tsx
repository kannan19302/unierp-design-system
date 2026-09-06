import type { Meta, StoryObj } from "@storybook/react";
import { SplitScreenAuditor } from "./split-screen-auditor";
import { Badge } from "../../primitives/badge";
import { Button } from "../../primitives/button";

const meta: Meta<typeof SplitScreenAuditor> = {
  title: "Layout/SplitScreenAuditor",
  component: SplitScreenAuditor,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof SplitScreenAuditor>;

export const InvoiceAPReconciliation: Story = {
  render: (args) => (
    <div style={{ height: "600px", width: "100%" }}>
      <SplitScreenAuditor
        {...args}
        documentTitle="Scanned Supplier Invoice (PDF)"
        formTitle="Extracted Accounts Payable Voucher"
        documentControls={
          <div style={{ display: "flex", gap: "var(--space-1)" }}>
            <Badge variant="neutral">Page 1 of 2</Badge>
            <Badge variant="success">OCR Confidence: 99.2%</Badge>
          </div>
        }
        formActions={
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Button variant="secondary">Flag Discrepancy</Button>
            <Button variant="primary">Approve Voucher</Button>
          </div>
        }
        documentViewer={
          <div
            style={{
              height: "100%",
              minHeight: "350px",
              backgroundColor: "var(--color-bg-subtle)",
              border: "1px dashed var(--color-border)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "var(--space-4)",
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: "var(--weight-bold)", fontSize: "var(--text-md)" }}>
              Apex Logistics Corp — Invoice #INV-2026-901
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
              [High-resolution document viewer rendering source raster/PDF scan with OCR bounding boxes]
            </p>
          </div>
        }
        auditForm={
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
              <div>
                <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                  Supplier Name
                </label>
                <div style={{ fontWeight: "var(--weight-medium)" }}>Apex Logistics Corp</div>
              </div>
              <div>
                <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                  Invoice Date
                </label>
                <div style={{ fontWeight: "var(--weight-medium)" }}>2026-09-01</div>
              </div>
              <div>
                <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                  Subtotal (Excl. Tax)
                </label>
                <div style={{ fontWeight: "var(--weight-mono)", fontFamily: "var(--font-mono)" }}>
                  $42,000.00
                </div>
              </div>
              <div>
                <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                  Tax Amount (GST 8%)
                </label>
                <div style={{ fontWeight: "var(--weight-mono)", fontFamily: "var(--font-mono)" }}>
                  $3,360.00
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-3)" }}>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)", marginBottom: "var(--space-1)" }}>
                General Ledger Line Distribution
              </div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                Debit: 5010 - Freight Expenses ($42,000.00) | Debit: 1300 - Input Tax ($3,360.00)
              </p>
            </div>
          </div>
        }
      />
    </div>
  ),
  args: {
    defaultSplitRatio: 50,
    density: "compact",
  },
};

export const UltraCompactDensity: Story = {
  render: (args) => (
    <div style={{ height: "450px", width: "100%" }}>
      <SplitScreenAuditor
        {...args}
        documentViewer={<div style={{ padding: "var(--space-2)" }}>Document Raster</div>}
        auditForm={<div style={{ padding: "var(--space-2)" }}>Audit Form Fields</div>}
      />
    </div>
  ),
  args: {
    defaultSplitRatio: 40,
    density: "ultra-compact",
  },
};
