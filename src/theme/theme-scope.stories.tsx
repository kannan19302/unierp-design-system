import type { Meta, StoryObj } from "@storybook/react";
import { ThemeScope } from "./theme-scope";
import { Button } from "../components/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/card";
import { Badge } from "../components/badge";

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
          <CardHeader>
            <CardTitle>Compact Density</CardTitle>
            <Badge variant="primary">30px controls</Badge>
          </CardHeader>
          <CardContent style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <p style={{ fontSize: "var(--density-body-size)" }}>Optimized for high-volume data grids & operational desks.</p>
            <Button variant="primary">Compact Action</Button>
          </CardContent>
        </Card>
      </ThemeScope>

      <ThemeScope density="standard">
        <Card>
          <CardHeader>
            <CardTitle>Standard Density</CardTitle>
            <Badge variant="default">36px controls</Badge>
          </CardHeader>
          <CardContent style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <p style={{ fontSize: "var(--density-body-size)" }}>Default enterprise desktop & admin workspace balance.</p>
            <Button variant="primary">Standard Action</Button>
          </CardContent>
        </Card>
      </ThemeScope>

      <ThemeScope density="comfortable">
        <Card>
          <CardHeader>
            <CardTitle>Comfortable Density</CardTitle>
            <Badge variant="success">42px controls</Badge>
          </CardHeader>
          <CardContent style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <p style={{ fontSize: "var(--density-body-size)" }}>Touch-friendly & customer-facing portal density.</p>
            <Button variant="primary">Comfortable Action</Button>
          </CardContent>
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
              <CardHeader>
                <CardTitle style={{ textTransform: "capitalize" }}>{platform}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="primary" style={{ width: "100%" }}>
                  Accent Action
                </Button>
              </CardContent>
            </Card>
          </ThemeScope>
        )
      )}
    </div>
  ),
};
