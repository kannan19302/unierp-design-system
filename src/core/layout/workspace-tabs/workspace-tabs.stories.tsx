import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileText, ShoppingCart, Users, Settings, Package } from "lucide-react";
import { WorkspaceTabs, type WorkspaceTabItem } from "./workspace-tabs";

const meta: Meta<typeof WorkspaceTabs> = {
  title: "Core/Layout/WorkspaceTabs",
  component: WorkspaceTabs,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [{ id: "tabindex", enabled: true }],
      },
    },
  },
  argTypes: {
    tabs: {
      description: "List of open workspace tabs",
    },
    activeTabId: {
      control: "text",
      description: "Identifier of active workspace tab",
    },
    onSelectTab: {
      action: "tabSelected",
      description: "Callback invoked when a tab is selected",
    },
    onCloseTab: {
      action: "tabClosed",
      description: "Callback invoked to close a tab",
    },
    onNewTab: {
      action: "newTabRequested",
      description: "Callback invoked to create a new tab",
    },
    showNewTabButton: {
      control: "boolean",
      description: "Whether to show the plus new tab button",
    },
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
      <div style={{ padding: "var(--space-6)", background: "var(--color-surface-sunken)" }}>
        <WorkspaceTabs
          tabs={tabs}
          activeTabId={activeId}
          onSelectTab={setActiveId}
          onCloseTab={handleClose}
          onNewTab={handleNew}
        />
        <div
          style={{
            padding: "var(--space-6)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderBlockStart: "none",
            minBlockSize: "15rem",
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

export const AnatomyAndComposition: Story = {
  render: () => {
    return (
      <div style={{ padding: "var(--space-6)", background: "var(--color-surface-sunken)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <h4>Anatomy and Composition</h4>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
          WorkspaceTabs facilitates multi-document architecture with pinned sessions, dirty indicators,
          overflow scroll navigation, and tab-level actions.
        </p>
        <WorkspaceTabs
          tabs={initialTabs}
          activeTabId="inv-1024"
          onSelectTab={() => {}}
          onCloseTab={() => {}}
          onNewTab={() => {}}
        />
      </div>
    );
  },
};

export const AllStatesGallery: Story = {
  render: () => {
    const pinnedOnly: WorkspaceTabItem[] = [
      { id: "dash", title: "Dashboard", pinned: true, closable: false },
      { id: "reports", title: "GL Reports", pinned: true, closable: false },
    ];

    const dirtyTabs: WorkspaceTabItem[] = [
      { id: "edit-1", title: "Journal Entry #991", dirty: true, badge: "Draft" },
      { id: "edit-2", title: "Payroll Batch May", dirty: true },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-6)", background: "var(--color-surface-sunken)" }}>
        <div>
          <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Pinned Tabs Only</h5>
          <WorkspaceTabs
            tabs={pinnedOnly}
            activeTabId="dash"
            onSelectTab={() => {}}
            showNewTabButton={false}
          />
        </div>
        <div>
          <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Dirty / Unsaved States with Badges</h5>
          <WorkspaceTabs
            tabs={dirtyTabs}
            activeTabId="edit-1"
            onSelectTab={() => {}}
            onCloseTab={() => {}}
            onNewTab={() => {}}
          />
        </div>
        <div>
          <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Standard Mixed Session (Active, Inactive, Closable)</h5>
          <WorkspaceTabs
            tabs={initialTabs}
            activeTabId="po-889"
            onSelectTab={() => {}}
            onCloseTab={() => {}}
            onNewTab={() => {}}
          />
        </div>
      </div>
    );
  },
};
