import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { WysiwygCanvas, type SelectedElementMeta } from "./wysiwyg-canvas";

const meta: Meta<typeof WysiwygCanvas> = {
  title: "Studio/WysiwygCanvas",
  component: WysiwygCanvas,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
  argTypes: {
    deviceMode: {
      control: "select",
      options: ["desktop", "tablet", "mobile"],
      description: "Responsive viewport frame size",
    },
    zoom: {
      control: "number",
      description: "Zoom percentage",
    },
  },
};

export default meta;
type Story = StoryObj<typeof WysiwygCanvas>;

const MockPageContent = ({ onSelect }: { onSelect: (meta: SelectedElementMeta) => void }) => (
  <div style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
    <header
      onClick={() => onSelect({ id: "nav", name: "Navigation Header", width: "100%", height: 64 })}
      style={{
        padding: "var(--space-4)",
        border: "1px dashed var(--color-border)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <strong>UniERP Developer Platform</strong>
      <nav style={{ display: "flex", gap: "var(--space-4)", fontSize: "var(--font-size-sm)" }}>
        <span>Products</span>
        <span>Solutions</span>
        <span>Docs</span>
      </nav>
    </header>

    <section
      onClick={() => onSelect({ id: "hero", name: "Hero Banner", width: 1200, height: 420 })}
      style={{
        padding: "var(--space-10) var(--space-6)",
        background: "var(--color-surface-subtle)",
        borderRadius: "var(--radius-lg)",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <h1 style={{ fontSize: "var(--font-size-2xl)", margin: "0 0 var(--space-2) 0" }}>
        Build Enterprise Workflows Fast
      </h1>
      <p style={{ color: "var(--color-text-muted)", margin: "0 0 var(--space-4) 0" }}>
        Unify visual app building, database schemas, and micro-frontend deployments.
      </p>
      <button
        type="button"
        style={{
          background: "var(--color-brand)",
          color: "#fff",
          border: "none",
          padding: "var(--space-2) var(--space-4)",
          borderRadius: "var(--radius-md)",
          fontWeight: "var(--font-weight-medium)",
          cursor: "pointer",
        }}
      >
        Get Started Now
      </button>
    </section>
  </div>
);

const InteractiveCanvas = ({ initialMode = "desktop" }: { initialMode?: "desktop" | "tablet" | "mobile" }) => {
  const [selected, setSelected] = useState<SelectedElementMeta | null>({
    id: "hero",
    name: "Hero Banner",
    width: 1200,
    height: 420,
  });

  return (
    <div style={{ blockSize: "520px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
      <WysiwygCanvas
        deviceMode={initialMode}
        selectedElement={selected}
        onSelectElement={() => setSelected(null)}
        onDuplicateElement={(id) => alert(`Duplicate ${id}`)}
        onDeleteElement={(id) => {
          alert(`Delete ${id}`);
          setSelected(null);
        }}
      >
        <MockPageContent onSelect={setSelected} />
      </WysiwygCanvas>
    </div>
  );
};

export const Default: Story = {
  render: () => <InteractiveCanvas initialMode="desktop" />,
};

export const TabletMode: Story = {
  render: () => <InteractiveCanvas initialMode="tablet" />,
};

export const MobileMode: Story = {
  render: () => <InteractiveCanvas initialMode="mobile" />,
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        <strong>WysiwygCanvas Anatomy:</strong>
        <ol style={{ margin: "var(--space-2) 0", paddingInlineStart: "var(--space-4)" }}>
          <li>Backdrop Container (Dotted grid pattern with accessible boundary)</li>
          <li>Viewport Frame (Responsive constrained device shell: Desktop, Tablet 768px, Mobile 375px)</li>
          <li>Selected Element Overlay (2px solid active ring, 8 resize handles)</li>
          <li>Component Badge (Component name, dimensions, quick duplicate/delete buttons)</li>
        </ol>
      </div>
      <InteractiveCanvas />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Tablet Viewport</h4>
        <div style={{ blockSize: "400px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
          <InteractiveCanvas initialMode="tablet" />
        </div>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Mobile Viewport</h4>
        <div style={{ blockSize: "400px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
          <InteractiveCanvas initialMode="mobile" />
        </div>
      </div>
    </div>
  ),
};
