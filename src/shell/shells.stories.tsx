import type { Meta, StoryObj } from "@storybook/react";
import { InspectorShell } from "./inspector-shell";
import { WorkbenchShell } from "./workbench-shell";
import { Button } from "../components/button";
import { Badge } from "../components/badge";
import { Card } from "../components/card";

const meta: Meta = {
  title: "Shell/EnterpriseShells",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const InspectorShellStory: StoryObj = {
  name: "Inspector Shell (List + Detail Inspector)",
  render: () => (
    <InspectorShell
      header={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <h2>Order Management</h2>
          <Button variant="primary">New Order</Button>
        </div>
      }
      listPane={
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} style={{ padding: "var(--space-3)", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>ORD-100{i}</strong>
                <Badge variant="success">Fulfilled</Badge>
              </div>
              <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                Acme Industrial • $4,250.00
              </p>
            </Card>
          ))}
        </div>
      }
      inspectorPane={
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <h3>Order Inspection: ORD-1001</h3>
          <p>Customer: Acme Industrial Corp</p>
          <p>Total: $4,250.00</p>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Button variant="primary">Process Payment</Button>
            <Button variant="secondary">Print Bill of Lading</Button>
          </div>
        </div>
      }
    />
  ),
};

export const WorkbenchShellStory: StoryObj = {
  name: "Workbench Shell (Three-Pane)",
  render: () => (
    <WorkbenchShell
      header={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <h2>Developer API Workbench</h2>
          <Badge variant="primary">v2.4.0</Badge>
        </div>
      }
      leftPane={
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <h4>Endpoints</h4>
          <p>/api/v2/orders</p>
          <p>/api/v2/customers</p>
          <p>/api/v2/invoices</p>
        </div>
      }
      centerPane={
        <div>
          <h3>Request Payload & Parameters</h3>
          <pre style={{ background: "var(--color-bg-sunken)", padding: "var(--space-4)", borderRadius: "var(--radius-md)" }}>
            {`POST /api/v2/invoices HTTP/1.1\nHost: api.unierp.internal\nContent-Type: application/json\n\n{\n  "accountId": "ACC-992",\n  "amount": 1450.00\n}`}
          </pre>
        </div>
      }
      rightPane={
        <div>
          <h4>Response Inspector</h4>
          <Badge variant="success">200 OK (42ms)</Badge>
        </div>
      }
    />
  ),
};
