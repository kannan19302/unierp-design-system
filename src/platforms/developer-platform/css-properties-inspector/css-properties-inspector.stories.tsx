import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  CssPropertiesInspector,
  type CssPropertiesValues,
} from "./css-properties-inspector";

const meta: Meta<typeof CssPropertiesInspector> = {
  title: "Platforms/DeveloperPlatform/CssPropertiesInspector",
  component: CssPropertiesInspector,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CssPropertiesInspector>;

const InspectorInteractiveDemo = () => {
  const [styles, setStyles] = useState<CssPropertiesValues>({
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: "1.5rem",
    width: "100%",
    height: "auto",
    padding: "2rem",
    margin: "0 auto",
    fontSize: "1rem",
    fontWeight: "500",
    textAlign: "left",
    background: "var(--color-surface)",
    borderRadius: "var(--radius-lg)",
  });

  return (
    <div style={{ display: "flex", gap: "var(--space-6)", blockSize: "600px" }}>
      {/* Live Preview Pane */}
      <div
        style={{
          flex: "1 1 auto",
          padding: "var(--space-6)",
          background: "var(--color-surface-subtle)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: styles.display,
            flexDirection: styles.flexDirection,
            alignItems: styles.alignItems,
            gap: styles.gap,
            inlineSize: styles.width,
            padding: styles.padding,
            margin: styles.margin,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            textAlign: styles.textAlign,
            background: styles.background,
            borderRadius: styles.borderRadius,
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-sm)",
            maxInlineSize: "400px",
          }}
        >
          <h4 style={{ margin: 0 }}>Preview Card Element</h4>
          <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
            Styling adjusts in real-time as properties are modified in the inspector panel.
          </p>
        </div>
      </div>

      {/* Inspector Rail */}
      <div style={{ inlineSize: "320px", flexShrink: 0, border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <CssPropertiesInspector
          values={styles}
          onChange={(key, val) => setStyles((prev) => ({ ...prev, [key]: val }))}
        />
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <InspectorInteractiveDemo />,
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        <strong>CssPropertiesInspector Anatomy:</strong>
        <ol style={{ margin: "var(--space-2) 0", paddingInlineStart: "var(--space-4)" }}>
          <li>Panel Header (Title with clean border separator)</li>
          <li>Layout & Alignment (Flex/Grid display, directional segmented toggle, align, gap)</li>
          <li>Dimensions & Spacing (Width, height, padding, margin box model inputs)</li>
          <li>Typography (Font size, weight, text align)</li>
          <li>Appearance & Borders (Background color, border radius, shadows)</li>
        </ol>
      </div>
      <InspectorInteractiveDemo />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", blockSize: "480px" }}>
        <CssPropertiesInspector
          title="Card Layout Styles"
          values={{ display: "flex", flexDirection: "row", gap: "1rem", width: "100%", fontSize: "0.875rem" }}
          onChange={() => {}}
        />
      </div>
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", blockSize: "480px" }}>
        <CssPropertiesInspector
          title="Hero Banner Styles"
          values={{ display: "grid", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-xl)", padding: "3rem" }}
          onChange={() => {}}
        />
      </div>
    </div>
  ),
};
