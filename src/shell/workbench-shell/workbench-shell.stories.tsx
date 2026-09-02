import type { Meta, StoryObj } from "@storybook/react";
import { WorkbenchShell } from "./workbench-shell";

const meta: Meta<typeof WorkbenchShell> = {
  title: "Shell/WorkbenchShell",
  component: WorkbenchShell,
  parameters: { layout: "fullscreen" },
  argTypes: {
    topBar: { control: false },
    classificationTree: { control: false },
    recordList: { control: false },
    recordDetail: { control: false },
    children: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof WorkbenchShell>;

export const Default: Story = {
  args: {
    topBar: (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <h3 style={{ margin: 0 }}>Catalog Master Data Management</h3>
        <span>Session: Active</span>
      </div>
    ),
    classificationTree: (
      <div style={{ padding: "16px" }}>
        <h4>Categories</h4>
        <ul style={{ paddingLeft: "16px", margin: "8px 0" }}>
          <li>Hardware
            <ul>
              <li><strong>Fasteners</strong></li>
              <li>Brackets</li>
            </ul>
          </li>
          <li>Electrical</li>
        </ul>
      </div>
    ),
    recordList: (
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <h4>Fasteners (18 items)</h4>
        <div style={{ padding: "8px", background: "var(--color-bg-sunken)", borderRadius: "4px" }}>
          <strong>SKU-1001</strong><br />M8 Titanium Hex Bolt
        </div>
        <div style={{ padding: "8px" }}>
          <strong>SKU-1002</strong><br />M6 Stainless Steel Nut
        </div>
      </div>
    ),
    detailWorkspace: (
      <div style={{ padding: "24px" }}>
        <h3>SKU-1001: M8 Titanium Hex Bolt</h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Unit of Measure: Box (100 pcs) • Reorder Point: 50 • Stock: 420
        </p>
      </div>
    ),
  },
};
