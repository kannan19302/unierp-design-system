import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileText, ShoppingCart, Users, Settings, Package } from "lucide-react";
import { WorkspaceTabs, type WorkspaceTabItem } from "./workspace-tabs";

const meta: Meta<typeof WorkspaceTabs> = {
  title: "Layout/WorkspaceTabs",
  component: WorkspaceTabs,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof WorkspaceTabs>;

const initialTabs: WorkspaceTabItem[] = [
  {
    id: "dashboard",
    title: "Executive Dashboard",
    icon: <Users size={13} aria-hidden="true" />,
    pinned: true,
    closable: false,
  },
  {
    id: "inv-1024",
    title: "Invoice #INV-2026-1024",
    icon: <FileText size={13} aria-hidden="true" />,
    dirty: true,
    badge: "Unsaved",
  },
  {
    id: "po-889",
    title: "Purchase Order #PO-889",
    icon: <ShoppingCart size={13} aria-hidden="true" />,
  },
  {
    id: "sku-5541",
    title: "Item SKU-5541 - Industrial Pump",
    icon: <Package size={13} aria-hidden="true" />,
  },
  {
    id: "tax-config",
    title: "Global Tax Configuration",
    icon: <Settings size={13} aria-hidden="true" />,
  },
];

export const Default: Story = {
  render: () => {
    const [tabs, setTabs] = useState<WorkspaceTabItem[]>(initialTabs);
    const [activeId, setActiveId] = useState("inv-1024");

    const handleClose = (id: string) => {
      const filtered = tabs.filter((t) => t.id !== id);
      setTabs(filtered);
      if (activeId === id && filtered.length > 0) {
        setActiveId(filtered[0]!.id);
      }
    };

    const handleNew = () => {
      const newId = `new-doc-${Date.now()}`;
      const newTab: WorkspaceTabItem = {
        id: newId,
        title: `New Document (${tabs.length + 1})`,
        dirty: true,
      };
      setTabs([...tabs, newTab]);
      setActiveId(newId);
    };

    return (
      <div style={{ padding: "1.5rem", background: "var(--color-surface-sunken)" }}>
        <WorkspaceTabs
          tabs={tabs}
          activeTabId={activeId}
          onSelectTab={setActiveId}
          onCloseTab={handleClose}
          onNewTab={handleNew}
        />
        <div
          style={{
            padding: "2rem",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderTop: "none",
            minHeight: "15rem",
          }}
        >
          <h3>Active Workspace Session: {tabs.find((t) => t.id === activeId)?.title}</h3>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Document ID: <code>{activeId}</code>
          </p>
        </div>
      </div>
    );
  },
};
