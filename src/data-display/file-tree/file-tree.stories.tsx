import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileTree, type FileTreeNode } from "./file-tree";

const SAMPLE_FILES: FileTreeNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      {
        id: "components",
        name: "components",
        type: "folder",
        children: [
          { id: "button-tsx", name: "button.tsx", type: "file", extension: "tsx", size: "3.2 kB" },
          { id: "button-css", name: "button.module.css", type: "file", extension: "css", size: "1.4 kB" },
          { id: "button-test", name: "button.test.tsx", type: "file", extension: "tsx", size: "2.1 kB" },
        ],
      },
      {
        id: "tokens",
        name: "tokens",
        type: "folder",
        children: [
          { id: "tokens-css", name: "tokens.css", type: "file", extension: "css", size: "8.4 kB" },
          { id: "typography-css", name: "typography.css", type: "file", extension: "css", size: "2.9 kB" },
        ],
      },
      { id: "index-ts", name: "index.ts", type: "file", extension: "ts", size: "512 B" },
    ],
  },
  {
    id: "docs",
    name: "docs",
    type: "folder",
    children: [
      { id: "arch-pdf", name: "Architecture_Overview.pdf", type: "file", extension: "pdf", size: "1.4 MB" },
      { id: "readme-md", name: "README.md", type: "file", extension: "md", size: "4.8 kB" },
    ],
  },
  { id: "package-json", name: "package.json", type: "file", extension: "json", size: "1.2 kB" },
];

const meta: Meta<typeof FileTree> = {
  title: "Data Display/FileTree",
  component: FileTree,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof FileTree>;

function InteractiveFileTree() {
  const [selected, setSelected] = useState<string>("button-tsx");

  return (
    <div style={{ width: 320, padding: 12, border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
      <FileTree
        nodes={SAMPLE_FILES}
        selectedId={selected}
        defaultExpandedIds={["src", "components"]}
        onSelect={(node) => setSelected(node.id)}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <InteractiveFileTree />,
};
