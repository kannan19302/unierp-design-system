import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ImageUpload } from "./image-upload";

/**
 * `ImageUpload` delivers a square or bounded image drop target with immediate thumbnail preview,
 * accessible keyboard controls, and native file system dialog integration.
 *
 * ### Architectural Features
 * - **WAI-ARIA Pattern**: `role="button"` with `aria-label` and `aria-disabled`.
 * - **Instant Image Preview**: Automatically renders thumbnail replacement when valid source URL is supplied.
 * - **Strata DL Design Tokens**: Uses border radius, subtle hover border accents, and neutral background tokens.
 */
const meta: Meta<typeof ImageUpload> = {
  title: "Core/Inputs/ImageUpload",
  component: ImageUpload,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Compact square image upload component displaying placeholder or live thumbnail preview.",
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
    return <ImageUpload {...args} value={imgUrl} onChange={setImgUrl} />;
  },
  args: {
    disabled: false,
  },
};

export const WithPreview: Story = {
  args: {
    value: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    disabled: false,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => {
    const [imgUrl, setImgUrl] = useState<string | undefined>(
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", maxWidth: 360 }}>
        <div style={{ padding: "var(--space-md)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "bold", color: "var(--color-fg-muted)", marginBottom: "var(--space-xs)" }}>
            ANATOMY: BOUNDED TRIGGER / IMAGE ICON / PREVIEW FRAME
          </div>
          <ImageUpload value={imgUrl} onChange={setImgUrl} />
        </div>
      </div>
    );
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-lg)", alignItems: "flex-start", flexWrap: "wrap" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Empty State
        </h4>
        <ImageUpload />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Populated Preview
        </h4>
        <ImageUpload value="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Disabled Empty
        </h4>
        <ImageUpload disabled />
      </div>
    </div>
  ),
};
