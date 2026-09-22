import type { Meta, StoryObj } from "@storybook/react";
import { ThemeScope } from "./theme-scope";
import { Button } from "../../primitives/button";
import { Card } from "../../data-display/card";
import { Badge } from "../../primitives/badge";


const meta: Meta<typeof ThemeScope> = {
  title: "Theme/ThemeScope",
  component: ThemeScope,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof ThemeScope>;

export const DensityComparison: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)" }}>
      <ThemeScope density="compact">
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
            <h4 style={{ margin: 0, fontSize: "var(--text-base)" }}>Compact Density</h4>
            <Badge variant="primary">30px controls</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <p style={{ margin: 0, fontSize: "var(--density-body-size)" }}>Optimized for high-volume data grids & operational desks.</p>
            <Button variant="primary">Compact Action</Button>
          </div>
        </Card>
      </ThemeScope>

      <ThemeScope density="standard">
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
            <h4 style={{ margin: 0, fontSize: "var(--text-base)" }}>Standard Density</h4>
            <Badge variant="default">36px controls</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <p style={{ margin: 0, fontSize: "var(--density-body-size)" }}>Default enterprise desktop & admin workspace balance.</p>
            <Button variant="primary">Standard Action</Button>
          </div>
        </Card>
      </ThemeScope>

      <ThemeScope density="comfortable">
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
            <h4 style={{ margin: 0, fontSize: "var(--text-base)" }}>Comfortable Density</h4>
            <Badge variant="success">42px controls</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <p style={{ margin: 0, fontSize: "var(--density-body-size)" }}>Touch-friendly & customer-facing portal density.</p>
            <Button variant="primary">Comfortable Action</Button>
          </div>
        </Card>
      </ThemeScope>
    </div>
  ),
};

export const PlatformAccentsComparison: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-3)" }}>
      {(["apps", "tenant-admin", "platform-admin", "developer", "ops", "marketing", "marketplace", "website"] as const).map(
        (platform) => (
          <ThemeScope key={platform} platform={platform}>
            <Card>
              <div style={{ marginBottom: "var(--space-2)" }}>
                <h4 style={{ margin: 0, fontSize: "var(--text-base)", textTransform: "capitalize" }}>{platform}</h4>
              </div>
              <div>
                <Button variant="primary" style={{ width: "100%" }}>
                  Accent Action
                </Button>
              </div>
            </Card>
          </ThemeScope>
        )
      )}
    </div>
  ),
};
