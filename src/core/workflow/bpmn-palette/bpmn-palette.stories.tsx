import type { Meta, StoryObj } from "@storybook/react";
import { BpmnPalette } from "./bpmn-palette";

const meta: Meta<typeof BpmnPalette> = {
  title: "Workflow/BpmnPalette",
  component: BpmnPalette,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BpmnPalette>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "280px", blockSize: "540px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <BpmnPalette
        onSelectNode={(node) => console.log("Selected node", node)}
        onDragStartNode={(node) => console.log("Dragging node", node)}
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        <strong>BpmnPalette Anatomy:</strong>
        <ol style={{ margin: "var(--space-2) 0", paddingInlineStart: "var(--space-4)" }}>
          <li>Palette Header (Title + instant search filter input)</li>
          <li>Category Groups (Events, Activities, Gateways, Data storage)</li>
          <li>Node Item (BPMN standard icon glyph, label, draggable attribute)</li>
          <li>Native Drag-and-Drop dataTransfer payload support for canvas drop zones</li>
        </ol>
      </div>
      <div style={{ inlineSize: "280px", blockSize: "500px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <BpmnPalette />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "280px 280px", gap: "var(--space-4)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Full Palette</h4>
        <div style={{ blockSize: "460px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <BpmnPalette />
        </div>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Filtered Elements</h4>
        <div style={{ blockSize: "460px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <BpmnPalette
            items={[
              { id: "e1", name: "Start Event", category: "events", description: "Process start" },
              { id: "e2", name: "Timer Event", category: "events", description: "Delay trigger" },
              { id: "a1", name: "Approval Task", category: "activities", description: "Manager review" },
              { id: "g1", name: "Exclusive Gateway", category: "gateways", description: "Binary branch" },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};
