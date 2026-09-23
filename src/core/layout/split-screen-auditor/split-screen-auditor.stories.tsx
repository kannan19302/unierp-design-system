import type { Meta, StoryObj } from "@storybook/react";
import { SplitScreenAuditor } from "./split-screen-auditor";
import { Badge } from "../../primitives/badge";
import { Button } from "../../primitives/button";

const meta: Meta<typeof SplitScreenAuditor> = {
  title: "Core/Layout/SplitScreenAuditor",
  component: SplitScreenAuditor,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SplitScreenAuditor>;

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ blockSize: "600px", inlineSize: "100%" }}>
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
            <Button variant="outline" size="sm">Flag Discrepancy</Button>
            <Button size="sm">Approve Voucher</Button>
          </div>
        }
        documentViewer={
          <div
            style={{
              blockSize: "100%",
              minBlockSize: "350px",
              backgroundColor: "var(--color-bg-subtle)",
              border: "1px dashed var(--color-border-default)",
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
                <div style={{ fontFamily: "var(--font-mono)" }}>
                  $42,000.00
                </div>
              </div>
              <div>
                <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                  Tax Amount (GST 8%)
                </label>
                <div style={{ fontFamily: "var(--font-mono)" }}>
                  $3,360.00
                </div>
              </div>
            </div>

            <div style={{ borderBlockStart: "1px solid var(--color-border-default)", paddingBlockStart: "var(--space-3)" }}>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)", marginBlockEnd: "var(--space-1)" }}>
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

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Balanced 50/50 Split (Standard)</h4>
        <div style={{ blockSize: "400px", inlineSize: "100%" }}>
          <SplitScreenAuditor
            documentTitle="Source Evidence"
            formTitle="Audit Checklist"
            defaultSplitRatio={50}
            documentViewer={<div style={{ padding: "16px" }}>PDF Evidence Stream</div>}
            auditForm={<div style={{ padding: "16px" }}>Checklist Form Verification</div>}
          />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Ultra-Compact Density (40/60 Split)</h4>
        <div style={{ blockSize: "300px", inlineSize: "100%" }}>
          <SplitScreenAuditor
            documentTitle="Doc"
            formTitle="Ledger"
            defaultSplitRatio={40}
            density="ultra-compact"
            documentViewer={<div style={{ padding: "8px" }}>Compact Preview</div>}
            auditForm={<div style={{ padding: "8px" }}>Compact Ledger Table</div>}
          />
        </div>
      </div>
    </div>
  ),
};

export const InvoiceAPReconciliation: Story = {
  ...AnatomyAndComposition,
};

