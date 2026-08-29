import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { FileTree, type FileTreeNode } from "./file-tree";

const testNodes: FileTreeNode[] = [
  {
    id: "folder-1",
    name: "src",
    type: "folder",
    children: [
      { id: "file-1", name: "index.ts", type: "file", extension: "ts" },
    ],
  },
  { id: "file-2", name: "README.md", type: "file", extension: "md" },
];

describe("FileTree Component", () => {
  it("renders root files and toggles directory expansion", () => {
    render(<FileTree nodes={testNodes} defaultExpandedIds={[]} />);

    expect(screen.getByText("src")).toBeInTheDocument();
    expect(screen.getByText("README.md")).toBeInTheDocument();
    expect(screen.queryByText("index.ts")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("src"));
    expect(screen.getByText("index.ts")).toBeInTheDocument();
  });

  it("fires onSelect when a file node is clicked", () => {
    const onSelect = vi.fn();
    render(<FileTree nodes={testNodes} onSelect={onSelect} />);

    fireEvent.click(screen.getByText("README.md"));
    expect(onSelect).toHaveBeenCalledWith(testNodes[1]);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <FileTree nodes={testNodes} defaultExpandedIds={["folder-1"]} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
