import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ImageUpload } from "./image-upload";

/**
 * `ImageUpload` delivers a bounded image drop target with immediate thumbnail preview,
 * clear action, 4-tier density scaling, accessible keyboard controls, and native file dialog integration.
 *
 * ### Architectural Features
 * - **WAI-ARIA Pattern**: `role="button"` with `aria-label`, `aria-disabled`, and `aria-invalid`.
 * - **Instant Image Preview**: Automatically renders thumbnail replacement with clear trigger.
 * - **4-Tier Density**: Ultra-compact (48px avatar/icon), Compact (72px), Standard (112px), Comfortable (160px).
 */
const meta: Meta<typeof ImageUpload> = {
  title: "Core/Inputs/ImageUpload",
  component: ImageUpload,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Compact image upload component supporting thumbnail preview, density tiers, and keyboard triggering.",
      },
    },
  },
  argTypes: {
    value: {
      control: "text",
      description: "URL or base64 string of the uploaded image preview",
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction with the image trigger",
    },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "4-tier density scaling",
    },
    onChange: {
      action: "imageSelected",
      description: "Callback invoked with the generated object URL",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

export const Default: Story = {
  render: (args) => {
    const [imgUrl, setImgUrl] = useState(args.value);
    return <ImageUpload {...args} label="User Avatar" value={imgUrl} onChange={setImgUrl} />;
  },
  args: {
    disabled: false,
  },
};

export const DensityTiers: Story = {
  render: () => {
    const sampleImg = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
    return (
      <div style={{ display: "flex", gap: "var(--space-6)", alignItems: "flex-end", flexWrap: "wrap" }}>
        <ImageUpload density="ultra-compact" label="Ultra-compact (48px)" value={sampleImg} />
        <ImageUpload density="compact" label="Compact (72px)" value={sampleImg} />
        <ImageUpload density="standard" label="Standard (112px)" value={sampleImg} />
        <ImageUpload density="comfortable" label="Comfortable (160px)" value={sampleImg} />
      </div>
    );
  },
};

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Empty State</h4>
        <ImageUpload label="Profile Picture" />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Populated State</h4>
        <ImageUpload
          label="Profile Picture"
          value="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Error State</h4>
        <ImageUpload label="Organization Badge" invalid error="Image must be PNG or SVG under 2MB" />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Disabled State</h4>
        <ImageUpload label="Locked Avatar" disabled />
      </div>
    </div>
  ),
};

export const V1WorkspacePreview: Story = {
  render: () => (
    <div style={{ padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-lg)", maxWidth: 500 }}>
      <div style={{ marginBottom: "var(--space-3)", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-2)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--font-size-md)", fontWeight: "var(--weight-semibold)" }}>Product Catalog Asset</h3>
        <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          Upload high-resolution SKU hero photography for the enterprise catalog.
        </p>
      </div>
      <ImageUpload
        label="SKU Main Image"
        description="Supported formats: JPEG, PNG, WebP up to 5MB."
        value="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80"
      />
    </div>
  ),
};
