"use client";

import { useState, type ReactNode } from "react";
import {
  Folder,
  FolderOpen,
  File,
  FileCode,
  FileText,
  FileImage,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../utils/cn";
import styles from "./file-tree.module.css";

export interface FileTreeNode {
  id: string;
  name: string;
  type: "file" | "folder";
  extension?: string;
  children?: FileTreeNode[];
  size?: number | string;
  disabled?: boolean;
}

export interface FileTreeProps {
  nodes: FileTreeNode[];
  selectedId?: string;
  onSelect?: (node: FileTreeNode) => void;
  defaultExpandedIds?: string[];
  selectable?: boolean;
  className?: string;
}

function getFileIcon(type: "file" | "folder", isOpen: boolean, ext?: string): ReactNode {
  if (type === "folder") {
    return isOpen ? (
      <FolderOpen size={16} className={styles.folderIcon} aria-hidden="true" />
    ) : (
      <Folder size={16} className={styles.folderIcon} aria-hidden="true" />
    );
  }

  const cleanExt = ext?.replace(".", "").toLowerCase();
  switch (cleanExt) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
    case "json":
    case "html":
    case "css":
      return <FileCode size={16} className={styles.codeIcon} aria-hidden="true" />;
    case "md":
    case "txt":
    case "pdf":
    case "doc":
    case "docx":
      return <FileText size={16} className={styles.textIcon} aria-hidden="true" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "svg":
    case "webp":
      return <FileImage size={16} className={styles.imageIcon} aria-hidden="true" />;
    default:
      return <File size={16} className={styles.fileIcon} aria-hidden="true" />;
  }
}

interface NodeItemProps {
  node: FileTreeNode;
  depth: number;
  selectedId?: string;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  onSelect?: (node: FileTreeNode) => void;
}

function NodeItem({
  node,
  depth,
  selectedId,
  expandedIds,
  toggleExpand,
  onSelect,
}: NodeItemProps) {
  const isFolder = node.type === "folder";
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  const handleClick = () => {
    if (node.disabled) return;
    if (isFolder) {
      toggleExpand(node.id);
    }
    onSelect?.(node);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (node.disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    } else if (isFolder && e.key === "ArrowRight" && !isExpanded) {
      e.preventDefault();
      toggleExpand(node.id);
    } else if (isFolder && e.key === "ArrowLeft" && isExpanded) {
      e.preventDefault();
      toggleExpand(node.id);
    }
  };

  return (
    <li role="treeitem" aria-expanded={isFolder ? isExpanded : undefined} aria-selected={isSelected}>
      <div
        className={cn(
          styles.row,
          isSelected && styles.selected,
          node.disabled && styles.disabled,
        )}
        style={{ paddingLeft: `calc(${depth} * var(--space-4, 16px) + var(--space-2, 8px))` }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={node.disabled ? -1 : 0}
      >
        <span className={styles.chevronSlot}>
          {isFolder && (
            <button
              type="button"
              className={styles.chevronBtn}
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              aria-label={isExpanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
        </span>

        <span className={styles.iconSlot}>
          {getFileIcon(node.type, isExpanded, node.extension)}
        </span>

        <span className={styles.name}>{node.name}</span>

        {node.size && <span className={styles.size}>{node.size}</span>}
      </div>

      {isFolder && isExpanded && node.children && (
        <ul role="group" className={styles.childrenList}>
          {node.children.map((child) => (
            <NodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function FileTree({
  nodes,
  selectedId,
  onSelect,
  defaultExpandedIds = [],
  className,
}: FileTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(defaultExpandedIds),
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <ul role="tree" className={cn(styles.treeRoot, className)} aria-label="File tree navigation">
      {nodes.map((node) => (
        <NodeItem
          key={node.id}
          node={node}
          depth={0}
          selectedId={selectedId}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
