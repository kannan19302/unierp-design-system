import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StudioCanvas } from "./studio-canvas";

const meta: Meta<typeof StudioCanvas> = {
  title: "Core/Studio/StudioCanvas",
  component: StudioCanvas,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["linear", "spatial"],
      description: "Measure and zoom behavior for linear (form/rule) vs spatial (BPMN/flow/page) artefacts",
    },
    label: {
      control: "text",
      description: "Accessible label for screen readers announcing the canvas surface",
    },
    selectionRole: {
      control: "select",
      options: ["group", "listbox"],
      description: "ARIA role for selection container",
    },
    isEmpty: {
      control: "boolean",
      description: "Whether the canvas shows the empty state placeholder",
    },
  },
};

export default meta;
type Story = StoryObj<typeof StudioCanvas>;

const CanvasInteractiveDemo = ({ variant = "linear" }: { variant?: "linear" | "spatial" }) => {
  const [selected, setSelected] = useState<string | null>("hero-section");

  return (
    <div
      style={{
        blockSize: "460px",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--color-surface-subtle)",
      }}
    >
      <StudioCanvas
        label="Page Builder Canvas"
        variant={variant}
        selectedId={selected}
        onSelect={setSelected}
        bottomDock={
          <div
            style={{
              padding: "var(--space-2) var(--space-4)",
              fontSize: "var(--font-size-xs)",
              color: "var(--color-text-muted)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Console: Ready (3 nodes rendered)</span>
            <span>Viewport: 100% (1440 × 900)</span>
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", padding: "var(--space-6)" }}>
          {[
            { id: "hero-section", title: "Hero Banner Component", desc: "Display large heading, call-to-action button and hero graphic." },
            { id: "feature-grid", title: "Feature Showcase Grid", desc: "3-column responsive card layout highlighting core value propositions." },
            { id: "pricing-table", title: "Enterprise Pricing Matrix", desc: "Tiered subscription options with monthly/annual billing toggles." },
          ].map((block) => (
            <div
              key={block.id}
              onClick={() => setSelected(block.id)}
              style={{
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                background: "var(--color-surface)",
                border:
                  selected === block.id
                    ? "2px solid var(--color-brand)"
                    : "1px solid var(--color-border)",
                cursor: "pointer",
                boxShadow: selected === block.id ? "var(--shadow-sm)" : "none",
                transition: "all var(--duration-fast) ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "var(--space-1)" }}>
                <span
                  style={{
                    fontSize: "var(--font-size-xs)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: selected === block.id ? "var(--color-brand)" : "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {block.id}
                </span>
                {selected === block.id && (
                  <span
                    style={{
                      fontSize: "var(--font-size-xs)",
                      padding: "var(--space-0-5) var(--space-2)",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--color-brand-subtle)",
                      color: "var(--color-brand)",
                      fontWeight: "var(--font-weight-medium)",
                    }}
                  >
                    Selected
                  </span>
                )}
              </div>
              <h4 style={{ margin: "0 0 var(--space-1) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text)" }}>
                {block.title}
              </h4>
              <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                {block.desc}
              </p>
            </div>
          ))}
        </div>
      </StudioCanvas>
    </div>
  );
};

export const Default: Story = {
  render: () => <CanvasInteractiveDemo variant="linear" />,
};

export const SpatialVariant: Story = {
  render: () => <CanvasInteractiveDemo variant="spatial" />,
};

export const EmptyState: Story = {
  args: {
    label: "Empty Canvas",
    isEmpty: true,
    empty: (
      <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
        <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", margin: 0 }}>
          No components placed on canvas yet. Drag items from the palette to start building.
        </p>
      </div>
    ),
    children: null,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        <strong>StudioCanvas Anatomy:</strong>
        <ol style={{ margin: "var(--space-2) 0", paddingInlineStart: "var(--space-4)" }}>
          <li>Outer Container (Accessible boundary with <code>role=&quot;group&quot;</code> or <code>role=&quot;listbox&quot;</code>)</li>
          <li>Canvas Body (Scrollable or spatial work area)</li>
          <li>Optional Selection Overlay Layer (Bounding box, resize anchors, component labels)</li>
          <li>Optional Bottom Dock (Console output, data query inspector, simulation breakdown)</li>
        </ol>
      </div>
      <CanvasInteractiveDemo />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Populated Linear Canvas</h4>
        <CanvasInteractiveDemo variant="linear" />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Empty State Canvas</h4>
        <div
          style={{
            blockSize: "460px",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            background: "var(--color-surface-subtle)",
          }}
        >
          <StudioCanvas
            label="Empty Page Canvas"
            isEmpty={true}
            empty={
              <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
                <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", margin: 0 }}>
                  Drag elements here to construct your view
                </p>
              </div>
            }
          >
            <div />
          </StudioCanvas>
        </div>
      </div>
    </div>
  ),
};
