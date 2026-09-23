import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { StudioToolbar, type DevicePreviewMode } from "./studio-toolbar";
import { Button } from "../../primitives/button";

/**
 * `StudioToolbar` is the universal top action bar across all Developer Platform visual builders,
 * displaying breadcrumbs, auto-save status, device preview switchers, zoom controls, and standard verbs.
 *
 * ### Architectural Features
 * - **Unified Studio Identity**: Standardized position for project identity and breadcrumbs.
 * - **Device Preview Switcher**: Instant viewport toggle between Desktop, Tablet, and Mobile.
 * - **Auto-Save Status**: Visual feedback for clean, in-flight, or dirty editor state.
 */
const meta: Meta<typeof StudioToolbar> = {
  title: "Core/Studio/StudioToolbar",
  component: StudioToolbar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Name of the active builder artefact",
    },
    saveStatus: {
      control: "select",
      options: ["saved", "saving", "unsaved"],
      description: "Editor save status indicator",
    },
    deviceMode: {
      control: "select",
      options: ["desktop", "tablet", "mobile"],
      description: "Active device preview mode",
    },
    zoomPercent: {
      control: "number",
      description: "Canvas zoom percentage",
    },
    dirty: {
      control: "boolean",
      description: "Whether uncommitted changes exist",
    },
  },
};

export default meta;
type Story = StoryObj<typeof StudioToolbar>;

export const Default: Story = {
  args: {
    name: "Supplier website",
    breadcrumbs: ["Acme Corp", "Supplier experience", "Supplier website", "Development", "Draft"],
    saveStatus: "saved",
    deviceMode: "desktop",
    zoomPercent: 100,
    secondaryAction: <Button variant="secondary" size="sm">Preview</Button>,
    primaryAction: <Button variant="primary" size="sm">Review release</Button>,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => {
    const [mode, setMode] = useState<DevicePreviewMode>("desktop");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        <div style={{ padding: "var(--space-md)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "bold", color: "var(--color-fg-muted)", marginBottom: "var(--space-xs)" }}>
            ANATOMY: BREADCRUMBS / AUTO-SAVE / DEVICE SWITCHER / ZOOM / PRIMARY CTAS
          </div>
          <StudioToolbar
            name="Supplier portal"
            breadcrumbs={["Acme Corp", "Supplier portal", "Development", "Draft"]}
            saveStatus="saved"
            deviceMode={mode}
            onDeviceModeChange={setMode}
            zoomPercent={100}
            secondaryAction={<Button variant="secondary" size="sm">Preview</Button>}
            primaryAction={<Button variant="primary" size="sm">Review release</Button>}
          />
        </div>
      </div>
    );
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Saved State (Website Builder Pattern)
        </h4>
        <StudioToolbar
          name="Corporate Website"
          breadcrumbs={["Acme Corp", "Corporate presence", "Websites", "Production"]}
          saveStatus="saved"
          deviceMode="desktop"
          zoomPercent={100}
          secondaryAction={<Button variant="secondary" size="sm">Preview</Button>}
          primaryAction={<Button variant="primary" size="sm">Review release</Button>}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Unsaved Changes with Mobile Preview Active
        </h4>
        <StudioToolbar
          name="Mobile Order Pad"
          breadcrumbs={["Acme Corp", "Field Service", "Mobile", "Draft"]}
          saveStatus="unsaved"
          deviceMode="mobile"
          zoomPercent={75}
          secondaryAction={<Button variant="secondary" size="sm">Preview</Button>}
          primaryAction={<Button variant="primary" size="sm">Review release</Button>}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Standard Five-Verbs Mode (Form Logic Builder)
        </h4>
        <StudioToolbar
          name="Customer Registration Form"
          kind="Form Layout"
          version="v1.4.2 · Draft"
          dirty={true}
          problemCount={2}
          validate={{ onAction: () => {} }}
          preview={{ onAction: () => {} }}
          testRun={{ onAction: () => {} }}
          publish={{ onAction: () => {} }}
        />
      </div>
    </div>
  ),
};
