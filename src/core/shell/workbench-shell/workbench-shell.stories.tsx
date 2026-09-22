import type { Meta, StoryObj } from "@storybook/react";
import { WorkbenchShell } from "./workbench-shell";
import { Badge } from "../../primitives/badge";
import { Button } from "../../primitives/button";

const meta: Meta<typeof WorkbenchShell> = {
  title: "Shell/WorkbenchShell",
  component: WorkbenchShell,
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "landmark-one-main", enabled: false },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    nested: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof WorkbenchShell>;

export const Default: Story = {
  args: {
    topBar: (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "var(--space-2) var(--space-4)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--font-size-md)" }}>Catalog Master Data Management</h3>
        <Badge variant="success">Active Session</Badge>
      </div>
    ),
    classificationTree: (
      <div style={{ padding: "var(--space-4)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0" }}>Categories</h4>
        <ul style={{ paddingInlineStart: "var(--space-4)", margin: 0, fontSize: "var(--font-size-sm)" }}>
          <li>Hardware
            <ul style={{ paddingInlineStart: "var(--space-4)" }}>
              <li><strong>Fasteners</strong></li>
              <li>Brackets</li>
            </ul>
          </li>
          <li>Electrical</li>
        </ul>
      </div>
    ),
    recordList: (
      <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0" }}>Fasteners (18 items)</h4>
        <div style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-sm)" }}>
          <strong>SKU-1001</strong><br />M8 Titanium Hex Bolt
        </div>
        <div style={{ padding: "var(--space-2)" }}>
          <strong>SKU-1002</strong><br />M6 Stainless Steel Nut
        </div>
      </div>
    ),
    detailWorkspace: (
      <div style={{ padding: "var(--space-6)" }}>
        <h3>SKU-1001: M8 Titanium Hex Bolt</h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Unit of Measure: Box (100 pcs) • Reorder Point: 50 • Stock: 420
        </p>
      </div>
    ),
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ height: "550px" }}>
      <WorkbenchShell
        topBar={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "var(--space-2) var(--space-4)" }}>
            <span style={{ fontWeight: "var(--font-weight-semibold)" }}>Product Information Management (PIM)</span>
            <Button variant="primary" size="sm">Save Product</Button>
          </div>
        }
        classificationTree={
          <div style={{ padding: "var(--space-4)" }}>
            <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBlockEnd: "var(--space-2)" }}>
              TAXONOMY
            </div>
            <div style={{ fontSize: "var(--font-size-sm)" }}>
              ▸ Industrial Components<br />
              &nbsp;&nbsp;▾ Mechanical Hardware<br />
              &nbsp;&nbsp;&nbsp;&nbsp;• <strong>High-Tensile Fasteners</strong><br />
              &nbsp;&nbsp;&nbsp;&nbsp;• Flanges & Gaskets<br />
              ▸ Fluid Handling
            </div>
          </div>
        }
        recordList={
          <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)" }}>
              MATCHING SKUS (4)
            </div>
            <div style={{ padding: "var(--space-2-5)", background: "var(--color-bg-surface-selected)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
              <strong>SKU-HT-890</strong>
              <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>Grade 8.8 Hex Cap Screw</div>
            </div>
            <div style={{ padding: "var(--space-2-5)", borderRadius: "var(--radius-sm)" }}>
              <strong>SKU-HT-891</strong>
              <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>Grade 10.9 Flange Bolt</div>
            </div>
          </div>
        }
        detailWorkspace={
          <div style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div>
              <h2 style={{ margin: 0 }}>SKU-HT-890: Grade 8.8 Hex Cap Screw</h2>
              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>Category: Industrial &gt; Mechanical &gt; Fasteners</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)", border: "1px solid var(--color-border)", padding: "var(--space-4)", borderRadius: "var(--radius-md)" }}>
              <div><span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>Tensile Strength</span><br /><strong>800 MPa</strong></div>
              <div><span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>Yield Strength</span><br /><strong>640 MPa</strong></div>
              <div><span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>Thread Pitch</span><br /><strong>1.25 mm</strong></div>
            </div>
          </div>
        }
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4)", background: "var(--color-bg-sunken)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          1. Populated 3-Pane Workbench State
        </h4>
        <div style={{ height: "320px", border: "1px solid var(--color-border)" }}>
          <WorkbenchShell
            classificationTree={<div style={{ padding: "var(--space-3)" }}>Taxonomy Tree</div>}
            recordList={<div style={{ padding: "var(--space-3)" }}>Queue (12 items)</div>}
            detailWorkspace={<div style={{ padding: "var(--space-4)" }}>Active record details.</div>}
          />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          2. Empty Tree / Unselected State
        </h4>
        <div style={{ height: "240px", border: "1px solid var(--color-border)" }}>
          <WorkbenchShell
            classificationTree={<div style={{ padding: "var(--space-4)", color: "var(--color-text-tertiary)" }}>No categories defined</div>}
            recordList={<div style={{ padding: "var(--space-4)", color: "var(--color-text-tertiary)" }}>Select a category</div>}
            detailWorkspace={<div style={{ padding: "var(--space-4)", color: "var(--color-text-tertiary)" }}>Select an item to view details</div>}
          />
        </div>
      </div>
    </div>
  ),
};
