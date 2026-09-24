import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "./scroll-area";

const meta: Meta<typeof ScrollArea> = {
  title: "Core/Primitives/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const VerticalScroll: Story = {
  render: () => (
    <ScrollArea
      maxHeight="200px"
      style={{
        width: "280px",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius)",
        padding: "12px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>Audit Events</h4>
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: "6px 8px",
              background: "var(--color-bg-subtle)",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            GL Entry #{1000 + i} posted by Admin
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const HorizontalScroll: Story = {
  render: () => (
    <ScrollArea
      orientation="horizontal"
      style={{
        width: "300px",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius)",
        padding: "8px",
      }}
    >
      <div style={{ display: "flex", gap: "8px", width: "600px" }}>
        {["Assets", "Liabilities", "Equity", "Revenue", "Expenses", "Tax Reserves"].map(
          (item) => (
            <div
              key={item}
              style={{
                flex: "0 0 100px",
                padding: "8px",
                background: "var(--color-bg-subtle)",
                borderRadius: "4px",
                textAlign: "center",
                fontSize: "12px",
              }}
            >
              {item}
            </div>
          )
        )}
      </div>
    </ScrollArea>
  ),
};

export const HiddenScrollbars: Story = {
  render: () => (
    <ScrollArea
      hideScrollbar
      maxHeight="150px"
      style={{
        width: "240px",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius)",
        padding: "8px",
      }}
    >
      <div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ padding: "4px 0", fontSize: "12px" }}>
            Clean scrollable item #{i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => {
    const Vert = VerticalScroll.render as React.ComponentType;
    const Horiz = HorizontalScroll.render as React.ComponentType;
    return (
      <div style={{ display: "flex", gap: "var(--space-6)" }}>
        <div>
          <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
            1. Vertical Scroll Area
          </h4>
          {Vert && <Vert />}
        </div>
        <div>
          <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
            2. Horizontal Scroll Area
          </h4>
          {Horiz && <Horiz />}
        </div>
      </div>
    );
  },
};
