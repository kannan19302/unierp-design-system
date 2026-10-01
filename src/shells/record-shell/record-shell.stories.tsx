import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RecordShell, ObjectPage, type ObjectSection } from "./record-shell";
import { MeridianBar } from "../strata-bar";
import { Button } from "../../primitives/button";
import { Badge } from "../../primitives/badge";
import { CheckCircle2, AlertTriangle, FileText, Building2, ShieldCheck, DollarSign } from "lucide-react";

const meta: Meta<typeof RecordShell> = {
  title: "Shells/RecordShell",
  component: RecordShell,
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
    railCollapsed: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof RecordShell>;

interface InvoiceItem {
  id: string;
  vendor: string;
  amount: string;
  date: string;
  status: "approved" | "review" | "disputed";
  po: string;
}

const SAMPLE_INVOICES: InvoiceItem[] = [
  { id: "INV-2027-0104", vendor: "Apex Semiconductor Fab", amount: "$42,650.00", date: "Sep 24, 2026", status: "review", po: "PO-9921" },
  { id: "INV-2027-0103", vendor: "Kyoto Robotics Ltd.", amount: "$18,920.00", date: "Sep 22, 2026", status: "approved", po: "PO-9874" },
  { id: "INV-2027-0102", vendor: "Bavaria Precision GmbH", amount: "$124,500.00", date: "Sep 20, 2026", status: "review", po: "PO-9812" },
  { id: "INV-2027-0101", vendor: "Nordic Clean Energy", amount: "$9,430.00", date: "Sep 18, 2026", status: "approved", po: "PO-9760" },
  { id: "INV-2027-0099", vendor: "Pacific Freight Cargo", amount: "$3,150.00", date: "Sep 15, 2026", status: "disputed", po: "PO-9640" },
];

function InteractiveRecordExperience({ initialCollapsed = false }: { initialCollapsed?: boolean }) {
  const [selectedId, setSelectedId] = useState("INV-2027-0104");
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const activeInvoice = SAMPLE_INVOICES.find((i) => i.id === selectedId) || SAMPLE_INVOICES[0];

  const sections: ObjectSection[] = [
    {
      id: "general",
      label: "General & Vendor",
      children: (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)", background: "var(--color-bg-elevated)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>Vendor Entity</div>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text)", marginTop: "2px" }}>{activeInvoice.vendor}</div>
            <div style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>Vendor ID: VND-40892 · Verified</div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>Terms & Currency</div>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text)", marginTop: "2px" }}>Net 30 · USD</div>
            <div style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>Due in 24 Days (Oct 18, 2026)</div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>Purchase Order</div>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-primary)", marginTop: "2px" }}>{activeInvoice.po}</div>
            <div style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>2-Way Matched: GRN-1049</div>
          </div>
        </div>
      ),
    },
    {
      id: "lines",
      label: "Invoice Line Items",
      children: (
        <div style={{ background: "var(--color-bg-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
          <table style={{ inlineSize: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
            <thead>
              <tr style={{ background: "var(--color-bg-sunken)", borderBlockEnd: "1px solid var(--color-border)", textAlign: "start", color: "var(--color-text-secondary)" }}>
                <th style={{ padding: "var(--space-2) var(--space-3)" }}>Item Code</th>
                <th style={{ padding: "var(--space-2) var(--space-3)" }}>Description</th>
                <th style={{ padding: "var(--space-2) var(--space-3)", textAlign: "end" }}>Qty</th>
                <th style={{ padding: "var(--space-2) var(--space-3)", textAlign: "end" }}>Unit Price</th>
                <th style={{ padding: "var(--space-2) var(--space-3)", textAlign: "end" }}>Line Total</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBlockEnd: "1px solid var(--color-border)" }}>
                <td style={{ padding: "var(--space-2) var(--space-3)", fontFamily: "monospace" }}>WAFER-300-TI</td>
                <td style={{ padding: "var(--space-2) var(--space-3)" }}>300mm Silicon EPI Wafers Prime Grade</td>
                <td style={{ padding: "var(--space-2) var(--space-3)", textAlign: "end" }}>25</td>
                <td style={{ padding: "var(--space-2) var(--space-3)", textAlign: "end" }}>$1,420.00</td>
                <td style={{ padding: "var(--space-2) var(--space-3)", textAlign: "end", fontWeight: 600 }}>$35,500.00</td>
              </tr>
              <tr style={{ borderBlockEnd: "1px solid var(--color-border)" }}>
                <td style={{ padding: "var(--space-2) var(--space-3)", fontFamily: "monospace" }}>PKG-NITRO-CL</td>
                <td style={{ padding: "var(--space-2) var(--space-3)" }}>Cleanroom Nitrogen Hermetic Packaging</td>
                <td style={{ padding: "var(--space-2) var(--space-3)", textAlign: "end" }}>25</td>
                <td style={{ padding: "var(--space-2) var(--space-3)", textAlign: "end" }}>$286.00</td>
                <td style={{ padding: "var(--space-2) var(--space-3)", textAlign: "end", fontWeight: 600 }}>$7,150.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr style={{ background: "var(--color-bg-sunken)", fontWeight: 700 }}>
                <td colSpan={4} style={{ padding: "var(--space-2) var(--space-3)", textAlign: "end" }}>Total Amount:</td>
                <td style={{ padding: "var(--space-2) var(--space-3)", textAlign: "end", color: "var(--color-text)" }}>{activeInvoice.amount}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ),
    },
    {
      id: "matching",
      label: "3-Way Match Verification",
      children: (
        <div style={{ background: "var(--color-bg-elevated)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--color-success-text)", fontWeight: 600, fontSize: "var(--text-xs)" }}>
            <CheckCircle2 size={16} />
            <span>Automated 3-Way Match Verified: Purchase Order, Receiving Receipt, and Invoice Totals Reconciled.</span>
          </div>
          <div style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
            Zero unit variance detected across 2 line items. Receiving logged at Dock 4 by warehouse manager.
          </div>
        </div>
      ),
    },
    {
      id: "audit",
      label: "Immutable Audit Trail",
      children: (
        <div style={{ background: "var(--color-bg-elevated)", padding: "var(--space-4)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-secondary)" }}>
            <span>EDI Invoice Ingestion (AS2 Gateway)</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>10:14:02 UTC</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-secondary)" }}>
            <span>TypeSafe AI Match Verification (Confidence 99.8%)</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>10:14:08 UTC</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-secondary)" }}>
            <span>Assigned to Senior AP Controller for Final Sign-off</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>10:15:20 UTC</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <RecordShell
      railCollapsed={collapsed}
      rail={
        <div style={{ paddingBlock: "var(--space-3)", paddingInline: "var(--space-2)", display: "flex", flexDirection: "column", gap: "var(--space-2)", inlineSize: "100%" }}>
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            style={{
              padding: "var(--space-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              background: "var(--color-bg-elevated)",
              cursor: "pointer",
              fontSize: "11px",
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            {collapsed ? "Expand" : "← Collapse Rail"}
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {[
              { label: "Accounts Payable", icon: DollarSign, active: true },
              { label: "Purchase Orders", icon: FileText, active: false },
              { label: "Vendor Registry", icon: Building2, active: false },
              { label: "Treasury Clearing", icon: ShieldCheck, active: false },
            ].map((mod, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  paddingBlock: "var(--space-2)",
                  paddingInline: "var(--space-2)",
                  borderRadius: "var(--radius-sm)",
                  background: mod.active ? "var(--color-primary)" : "transparent",
                  color: mod.active ? "var(--color-primary-text)" : "var(--color-text)",
                  fontSize: "var(--text-xs)",
                  fontWeight: mod.active ? 600 : 400,
                  cursor: "pointer",
                }}
              >
                <mod.icon size={16} />
                {!collapsed && <span>{mod.label}</span>}
              </div>
            ))}
          </div>
        </div>
      }
      bar={
        <MeridianBar
          segments={[
            { label: "Acme Global Treasury", href: "/" },
            { label: "Accounts Payable", href: "/ap" },
            { label: "Invoices", href: "/ap/invoices" },
            { label: activeInvoice.id },
          ]}
          state={{
            label: activeInvoice.status === "approved" ? "Approved" : activeInvoice.status === "review" ? "Pending Approval" : "Disputed",
            tone: activeInvoice.status === "approved" ? "success" : activeInvoice.status === "review" ? "warning" : "danger",
          }}
          action={{
            label: "Approve Payment",
            onClick: () => alert(`Approved ${activeInvoice.id}`),
          }}
          copyable
        />
      }
      list={
        <div style={{ display: "flex", flexDirection: "column", blockSize: "100%" }}>
          <div style={{ paddingBlock: "var(--space-3)", paddingInline: "var(--space-3)", borderBlockEnd: "1px solid var(--color-border)", background: "var(--color-bg-sunken)" }}>
            <h4 style={{ margin: 0, fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-secondary)" }}>
              Invoices Queue ({SAMPLE_INVOICES.length})
            </h4>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {SAMPLE_INVOICES.map((inv) => {
              const isSelected = selectedId === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedId(inv.id)}
                  style={{
                    paddingBlock: "var(--space-3)",
                    paddingInline: "var(--space-3)",
                    borderBlockEnd: "1px solid var(--color-border-subtle, var(--color-border))",
                    background: isSelected ? "var(--color-bg-hover, var(--color-bg-sunken))" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    borderInlineStart: isSelected ? "3px solid var(--color-primary)" : "3px solid transparent",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text)" }}>{inv.id}</span>
                    <Badge variant={inv.status === "approved" ? "success" : inv.status === "review" ? "warning" : "danger"}>
                      {inv.status}
                    </Badge>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>{inv.vendor}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-text)", fontVariantNumeric: "tabular-nums" }}>{inv.amount}</span>
                    <span style={{ fontSize: "10px", color: "var(--color-text-secondary)" }}>{inv.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      }
      detail={<ObjectPage sections={sections} activeId="general" />}
      inspector={
        <div style={{ paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div>
            <h4 style={{ margin: 0, fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-secondary)" }}>
              Contextual Inspector
            </h4>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginTop: "var(--space-1)" }}>{activeInvoice.id}</div>
          </div>

          <div style={{ padding: "var(--space-3)", background: "var(--color-bg-elevated)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-text-secondary)" }}>AI Validation Score</div>
            <div style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--color-success-text)" }}>99.8% Match</div>
            <div style={{ fontSize: "10px", color: "var(--color-text-secondary)" }}>Zero OCR discrepancies detected across optical scan and EDI payload.</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--text-xs)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Purchase Order:</span>
              <span style={{ fontWeight: 600 }}>{activeInvoice.po}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>General Ledger:</span>
              <span style={{ fontWeight: 600 }}>GL-2100 Accounts Payable</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Cost Center:</span>
              <span style={{ fontWeight: 600 }}>CC-400 Fab Operations</span>
            </div>
          </div>

          <div style={{ marginBlockStart: "auto", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <Button variant="primary" style={{ inlineSize: "100%" }}>Authorize Payment</Button>
            <Button variant="secondary" style={{ inlineSize: "100%" }}>Flag Dispute</Button>
          </div>
        </div>
      }
    />
  );
}

export const Default: Story = {
  render: () => <InteractiveRecordExperience />,
};

export const ThreePaneRecord: Story = {
  name: "Three-Pane Record",
  render: () => <InteractiveRecordExperience />,
};

export const CollapsedRail: Story = {
  name: "Collapsed Icon Rail Mode",
  render: () => <InteractiveRecordExperience initialCollapsed={true} />,
};

export const StateMatrix: Story = {
  name: "State Matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", padding: "var(--space-4)", background: "var(--color-bg-sunken)" }}>
      <div>
        <h4 style={{ marginBlockStart: 0, marginBlockEnd: "var(--space-2)", marginInline: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          1. Three-Column Populated Layout (List + Detail + Inspector)
        </h4>
        <div style={{ blockSize: "420px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
          <InteractiveRecordExperience />
        </div>
      </div>

      <div>
        <h4 style={{ marginBlockStart: 0, marginBlockEnd: "var(--space-2)", marginInline: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          2. Two-Column Streamlined Layout (List + Detail, No Inspector)
        </h4>
        <div style={{ blockSize: "360px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
          <RecordShell
            bar={<MeridianBar segments={[{ label: "finance" }, { label: "invoices" }]} />}
            list={<div style={{ padding: "var(--space-4)" }}>Invoice Master List</div>}
            detail={<div style={{ padding: "var(--space-4)" }}>Expanded Detail Workspace</div>}
          />
        </div>
      </div>
    </div>
  ),
};

export const DensityGallery: Story = {
  name: "Density scale comparison",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4)" }}>
      {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((density) => (
        <div key={density} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <div style={{ padding: "var(--space-2) var(--space-4)", background: "var(--color-bg-sunken)", fontWeight: 600, fontSize: "var(--text-xs)" }}>
            Density: {density}
          </div>
          <div style={{ blockSize: "260px" }}>
            <RecordShell
              density={density}
              bar={<MeridianBar density={density} segments={[{ label: "tenant" }, { label: "records" }]} />}
              list={<div style={{ padding: "var(--space-3)" }}>List ({density})</div>}
              detail={
                <ObjectPage
                  density={density}
                  sections={[
                    { id: "s1", label: "Overview", children: <p>Section content for {density}</p> },
                    { id: "s2", label: "Audit", children: <p>Audit entries</p> },
                  ]}
                  activeId="s1"
                />
              }
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const RtlPreview: Story = {
  name: "RTL Preview",
  render: () => (
    <div dir="rtl" style={{ blockSize: "100dvh" }}>
      <InteractiveRecordExperience />
    </div>
  ),
};
