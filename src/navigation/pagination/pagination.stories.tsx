import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./pagination";

const meta: Meta<typeof Pagination> = {
  title: "Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
    page: { control: "number" },
    pageCount: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    page: 4,
    pageCount: 15,
    density: "standard",
  },
};

export const Densities: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <Pagination density="ultra-compact" page={3} pageCount={10} onChange={() => {}} />
      <Pagination density="compact" page={3} pageCount={10} onChange={() => {}} />
      <Pagination density="standard" page={3} pageCount={10} onChange={() => {}} />
      <Pagination density="comfortable" page={3} pageCount={10} onChange={() => {}} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>First Page Selected</p>
        <Pagination page={1} pageCount={10} onChange={() => {}} />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Middle Page Selected</p>
        <Pagination page={5} pageCount={10} onChange={() => {}} />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Last Page Selected</p>
        <Pagination page={10} pageCount={10} onChange={() => {}} />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <Pagination page={1} pageCount={3} onChange={() => {}} />
      <Pagination page={2} pageCount={5} onChange={() => {}} />
      <Pagination page={10} pageCount={20} onChange={() => {}} />
    </div>
  ),
};
