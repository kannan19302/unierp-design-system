import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton, SkeletonText } from "./skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
### Skeleton — Low-Fidelity Shimmer Wireframe Placeholder

The **Skeleton** primitive renders animated shimmer placeholders for asynchronous data fetching, preventing cumulative layout shift (CLS) and maintaining perceived visual stability across complex enterprise dashboards.

#### Strata Design Specifications
- **Shimmer Animation**: 1.5s hardware-accelerated linear gradient sweep using theme background and border tokens.
- **Morphological Shapes**: Rectangular blocks, rounded pills, circular avatars (\`circle={true}\`), and multi-line paragraph text blocks via \`<SkeletonText />\`.
- **Custom Dimensions**: Fully configurable \`width\`, \`height\`, and \`radius\` via CSS custom property hooks (\`--skeleton-w\`, \`--skeleton-h\`, \`--skeleton-r\`).
- **WCAG 2.2 AA Compliance**: Automatically hidden from screen readers via \`aria-hidden="true"\` to prevent phantom assistive announcements during loading lifecycles.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    width: {
      control: "text",
      description: "Element width in CSS string or numeric pixels.",
      table: {
        type: { summary: "string | number" },
        defaultValue: { summary: "100%" },
      },
    },
    height: {
      control: "text",
      description: "Element height in CSS string or numeric pixels.",
      table: {
        type: { summary: "string | number" },
        defaultValue: { summary: "16" },
      },
    },
    circle: {
      control: "boolean",
      description: "Whether to render as a perfect circle (e.g. for user avatars).",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    radius: {
      control: "text",
      description: "Custom border radius token or pixel value.",
      table: {
        type: { summary: "string" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: 240,
    height: 20,
  },
};

export const Circle: Story = {
  args: {
    width: 48,
    height: 48,
    circle: true,
  },
};

export const AnatomyAndComposition: Story = {
  parameters: {
    docs: {
      description: {
        story: "Exploded composition showing how Skeleton wireframes combine to mirror composite UI components (Cards, Tables, and Detail Headers) during loading.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: 440 }}>
      <div
        style={{
          border: "1px dashed var(--color-border-focus)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-4)",
          background: "var(--color-bg-subtle)",
        }}
      >
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-3)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wider, 0.05em)",
          }}
        >
          Card Wireframe Anatomy (Avatar + Header Text + Hero Block + Body Paragraph)
        </div>
        <div
          style={{
            padding: "var(--space-4)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-bg-surface)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
            <Skeleton width={40} height={40} circle />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
              <Skeleton height={14} width="70%" />
              <Skeleton height={10} width="40%" />
            </div>
          </div>
          <Skeleton height={100} />
          <SkeletonText lines={2} />
        </div>
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  parameters: {
    docs: {
      description: {
        story: "Comprehensive matrix of Skeleton states: Geometric primitives, Multi-line typography blocks, and Data-grid table loading wireframes.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: 520 }}>
      <div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          1. Geometric Shapes (Circle, Rounded Block, Pill)
        </div>
        <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <Skeleton width={44} height={44} circle />
          <Skeleton width={120} height={32} radius="var(--radius-sm)" />
          <Skeleton width={80} height={24} radius="var(--radius-full)" />
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          2. Multi-Line Text Block (SkeletonText)
        </div>
        <div style={{ width: 340 }}>
          <SkeletonText lines={3} />
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          3. High-Density Data Grid Wireframe
        </div>
        <div
          style={{
            width: "100%",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-bg-surface)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "28px 1fr 100px 70px",
              gap: "var(--space-3)",
              padding: "var(--space-2) var(--space-3)",
              background: "var(--color-bg-muted)",
              borderBottom: "1px solid var(--color-border)",
              alignItems: "center",
            }}
          >
            <Skeleton width={16} height={16} radius="var(--radius-xs)" />
            <Skeleton width="60%" height={12} />
            <Skeleton width="50%" height={12} />
            <Skeleton width="40%" height={12} />
          </div>
          {[1, 2, 3].map((row) => (
            <div
              key={row}
              style={{
                display: "grid",
                gridTemplateColumns: "28px 1fr 100px 70px",
                gap: "var(--space-3)",
                padding: "var(--space-2) var(--space-3)",
                borderBottom: row < 3 ? "1px solid var(--color-border-subtle)" : "none",
                alignItems: "center",
              }}
            >
              <Skeleton width={16} height={16} radius="var(--radius-xs)" />
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <Skeleton width={20} height={20} circle />
                <Skeleton width={row % 2 === 0 ? "75%" : "50%"} height={12} />
              </div>
              <Skeleton width="65%" height={12} />
              <Skeleton width={50} height={18} radius="var(--radius-full)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
