import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";

const meta: Meta<typeof Card> = {
  title: "Compositions/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
      description: "Explicit padding override.",
    },
    hover: {
      control: "boolean",
      description: "Whether the card exhibits interactive elevation on hover.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    density: "standard",
    padding: "md",
    children: (
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0, fontSize: "var(--text-base)" }}>
          Ledger Reconciliation Card
        </h4>
        <p style={{ marginBlock: 0, marginInline: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Card container holding dense financial data structures.
        </p>
      </div>
    ),
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", inlineSize: "360px" }}>
      <Card padding="none">
        <CardHeader>
          <CardTitle>Quarterly Revenue Forecast</CardTitle>
          <CardDescription>Fiscal year 2026 performance targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ fontSize: "var(--text-sm)" }}>Projected Gross Run Rate: $48.2M ARR</div>
        </CardContent>
        <CardFooter>
          <button type="button" style={{ paddingBlock: "4px", paddingInline: "8px", fontSize: "12px" }}>
            View Full Report
          </button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0 }}>Ultra-Compact (24px headers / tight padding)</h5>
        <Card density="ultra-compact" padding="none">
          <CardHeader>
            <CardTitle>Ultra Compact Card</CardTitle>
            <CardDescription>Minimum footprint for high density tables</CardDescription>
          </CardHeader>
          <CardContent>Data density: 24px</CardContent>
        </Card>
      </div>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0 }}>Compact (28px headers)</h5>
        <Card density="compact" padding="none">
          <CardHeader>
            <CardTitle>Compact Card</CardTitle>
            <CardDescription>Dense data record preview</CardDescription>
          </CardHeader>
          <CardContent>Data density: 28px</CardContent>
        </Card>
      </div>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0 }}>Standard (32px headers)</h5>
        <Card density="standard" padding="none">
          <CardHeader>
            <CardTitle>Standard Card</CardTitle>
            <CardDescription>Default enterprise workspace layout</CardDescription>
          </CardHeader>
          <CardContent>Data density: 32px</CardContent>
        </Card>
      </div>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0 }}>Comfortable (40px headers)</h5>
        <Card density="comfortable" padding="none">
          <CardHeader>
            <CardTitle>Comfortable Card</CardTitle>
            <CardDescription>Spacious executive overview panel</CardDescription>
          </CardHeader>
          <CardContent>Data density: 40px</CardContent>
        </Card>
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0 }}>Padding None</h5>
        <Card padding="none">
          <div style={{ paddingBlock: "var(--space-2)", paddingInline: "var(--space-2)" }}>Content without internal padding</div>
        </Card>
      </div>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0 }}>Padding Small</h5>
        <Card padding="sm">Small padding variant</Card>
      </div>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0 }}>Padding Medium with Hover</h5>
        <Card padding="md" hover>Hoverable interactive card</Card>
      </div>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0 }}>Padding Large</h5>
        <Card padding="lg">Large padding spacious layout</Card>
      </div>
    </div>
  ),
};
