import type { Meta, StoryObj } from "@storybook/react";
import { ThemeScope } from "./theme-scope";
import { Button } from "../../primitives/button";
import { Card } from "../../data-display/card";
import { Badge } from "../../primitives/badge";


const meta: Meta<typeof ThemeScope> = {
  title: "Core/Theme/ThemeScope",
  component: ThemeScope,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Scopes theme modes, platform accents, and density tiers to localized sub-trees without polluting global document styles.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeScope>;

export const Default: Story = {
  render: () => (
    <ThemeScope platform="tenant-admin" density="standard">
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
          <h4 style={{ margin: 0, fontSize: "var(--text-base)" }}>Tenant Administration Sub-Tree</h4>
          <Badge variant="primary">Platform Accent</Badge>
        </div>
        <p style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--type-body, 13px)" }}>
          Components inside this scope inherit tenant-admin emerald accents and standard 32px density.
        </p>
        <Button variant="primary">Scoped Action Button</Button>
      </Card>
    </ThemeScope>
  ),
};

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

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => {
    const DensityView = DensityComparison.render as React.ComponentType;
    const AccentsView = PlatformAccentsComparison.render as React.ComponentType;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        <div>
          <h3 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)" }}>1. Density Spectrum</h3>
          {DensityView && <DensityView />}
        </div>
        <div>
          <h3 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)" }}>2. Platform Accents Spectrum</h3>
          {AccentsView && <AccentsView />}
        </div>
      </div>
    );
  },
};
