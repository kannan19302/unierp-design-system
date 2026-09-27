import type { Meta, StoryObj } from "@storybook/react";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const meta: Meta<typeof ToggleGroup> = {
  title: "Core/Primitives/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const SingleSelection: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="left" aria-label="Text alignment">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft size={14} />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter size={14} />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight size={14} />
      </ToggleGroupItem>
      <ToggleGroupItem value="justify" aria-label="Align justify">
        <AlignJustify size={14} />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const MultipleSelection: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={["bold", "italic"]} aria-label="Font formatting">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold size={14} />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic size={14} />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline size={14} />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const OutlineVariant: Story = {
  render: () => (
    <ToggleGroup type="single" variant="outline" defaultValue="day">
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
      <ToggleGroup type="single" size="sm" defaultValue="1">
        <ToggleGroupItem value="1">Small 1</ToggleGroupItem>
        <ToggleGroupItem value="2">Small 2</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" size="md" defaultValue="1">
        <ToggleGroupItem value="1">Medium 1</ToggleGroupItem>
        <ToggleGroupItem value="2">Medium 2</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" size="lg" defaultValue="1">
        <ToggleGroupItem value="1">Large 1</ToggleGroupItem>
        <ToggleGroupItem value="2">Large 2</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          1. Single Selection (Text Alignment)
        </h4>
        <ToggleGroup type="single" defaultValue="left" aria-label="Text alignment">
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeft size={14} />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenter size={14} />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRight size={14} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          2. Multiple Selection (Formatting)
        </h4>
        <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Font formatting">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold size={14} />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic size={14} />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <Underline size={14} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          3. Outline Variant (Fiscal Period Scope)
        </h4>
        <ToggleGroup type="single" variant="outline" defaultValue="q1">
          <ToggleGroupItem value="q1">Q1</ToggleGroupItem>
          <ToggleGroupItem value="q2">Q2</ToggleGroupItem>
          <ToggleGroupItem value="q3">Q3</ToggleGroupItem>
          <ToggleGroupItem value="q4">Q4</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  ),
};
