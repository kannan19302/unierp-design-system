"use client";

import { useState, type FC, type ReactNode } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

// ── Accordion & Collapsible ───────────────────────────
export interface AccordionItem {
  key: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
}

export const Accordion: FC<AccordionProps> = ({ items }) => {
  const [openKey, setOpenKey] = useState<string | null>(items[0]?.key || null);

  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      {items.map((item) => {
        const isOpen = openKey === item.key;
        return (
          <div key={item.key} style={{ borderBottom: "1px solid var(--color-border)" }}>
            <button
              onClick={() => setOpenKey(isOpen ? null : item.key)}
              style={{
                width: "100%",
                padding: "var(--space-3) var(--space-4)",
                background: "var(--color-bg-sunken)",
                border: "none",
                textAlign: "left",
                fontWeight: 600,
                fontSize: "var(--text-sm)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {item.title}
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {isOpen && <div style={{ padding: "var(--space-4)", fontSize: "var(--text-sm)" }}>{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
};

export const Collapsible: FC<{ title: ReactNode; children: ReactNode; defaultOpen?: boolean }> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          background: "none",
          border: "none",
          fontWeight: 600,
          fontSize: "var(--text-sm)",
          cursor: "pointer",
        }}
      >
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {title}
      </button>
      {open && <div style={{ marginTop: "var(--space-2)", paddingLeft: "var(--space-4)" }}>{children}</div>}
    </div>
  );
};

// ── SplitView & ResizablePanel ────────────────────────
export interface SplitViewProps {
  left: ReactNode;
  right: ReactNode;
  initialSplit?: number; // percentage
}

export const SplitView: FC<SplitViewProps> = ({ left, right, initialSplit = 30 }) => {
  const [split, setSplit] = useState(initialSplit);

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", overflow: "hidden" }}>
      <div style={{ width: `${split}%`, overflow: "auto" }}>{left}</div>
      <div
        onMouseDown={(e) => {
          const startX = e.clientX;
          const startSplit = split;
          const onMove = (moveEvent: MouseEvent) => {
            const delta = moveEvent.clientX - startX;
            const containerWidth = (e.currentTarget.parentNode as HTMLElement)?.clientWidth || 1000;
            const newSplit = Math.max(10, Math.min(90, startSplit + (delta / containerWidth) * 100));
            setSplit(newSplit);
          };
          const onUp = () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
          };
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        }}
        style={{
          width: "4px",
          background: "var(--color-border)",
          cursor: "col-resize",
          userSelect: "none",
        }}
      />
      <div style={{ width: `${100 - split}%`, overflow: "auto" }}>{right}</div>
    </div>
  );
};

export const ResizablePanel: FC<{ children: ReactNode }> = ({ children }) => {
  return <div style={{ resize: "both", overflow: "auto", border: "1px solid var(--color-border)", padding: "var(--space-3)" }}>{children}</div>;
};

// ── DescriptionList ───────────────────────────────────
export interface DescriptionItem {
  label: ReactNode;
  value: ReactNode;
}

export interface DescriptionListProps {
  items: DescriptionItem[];
}

export const DescriptionList: FC<DescriptionListProps> = ({ items }) => {
  return (
    <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "var(--space-2) var(--space-4)", fontSize: "var(--text-sm)" }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ display: "contents" }}>
          <dt style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>{item.label}</dt>
          <dd style={{ margin: 0, color: "var(--color-text)" }}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};

// ── Timeline ──────────────────────────────────────────
export interface TimelineItem {
  id: string;
  title: string;
  timestamp: string;
  description?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline: FC<TimelineProps> = ({ items }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingLeft: "var(--space-4)" }}>
      {items.map((item) => (
        <div key={item.id} style={{ position: "relative", paddingLeft: "var(--space-4)", borderLeft: "2px solid var(--color-border)" }}>
          <div
            style={{
              position: "absolute",
              left: "-5px",
              top: "4px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--color-primary)",
            }}
          />
          <div style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>{item.title}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{item.timestamp}</div>
          {item.description && <div style={{ fontSize: "var(--text-xs)", marginTop: "var(--space-1)" }}>{item.description}</div>}
        </div>
      ))}
    </div>
  );
};

// ── TreeView ──────────────────────────────────────────
export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeViewProps {
  nodes: TreeNode[];
  onNodeSelect?: (node: TreeNode) => void;
}

export const TreeView: FC<TreeViewProps> = ({ nodes, onNodeSelect }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (node: TreeNode) => {
    const isExpanded = expanded[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} style={{ paddingLeft: "var(--space-3)" }}>
        <div
          onClick={() => {
            if (hasChildren) toggle(node.id);
            onNodeSelect?.(node);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-1)",
            padding: "var(--space-1) var(--space-2)",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            fontSize: "var(--text-sm)",
          }}
        >
          {hasChildren ? isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} /> : <span style={{ width: 14 }} />}
          <span>{node.label}</span>
        </div>
        {hasChildren && isExpanded && <div>{node.children!.map(renderNode)}</div>}
      </div>
    );
  };

  return <div>{nodes.map(renderNode)}</div>;
};
