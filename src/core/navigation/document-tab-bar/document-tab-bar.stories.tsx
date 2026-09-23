import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Folder, Box, Globe, Code2 } from "lucide-react";
import { DocumentTabBar, type DocumentTabItem } from "./document-tab-bar";

const visualProjectTabs: DocumentTabItem[] = [
  { id: "projects", title: "Core/Navigation/DocumentTabBar", icon: <Folder size={14} />, isClosable: true },
  { id: "supplier_exp", title: "Supplier experience", icon: <Box size={14} />, isClosable: true },
  { id: "corp_website", title: "Corporate website", icon: <Globe size={14} />, isClosable: true },
  { id: "supplier_portal", title: "Supplier portal", icon: <Box size={14} />, isDirty: true, isClosable: true },
  { id: "address_form", title: "Address form", icon: <Code2 size={14} />, isClosable: true },
];

/**
 * `DocumentTabBar` powers the multi-document navigation bar in the Strata Developer Platform,
 * enabling developers to keep projects, visual builders, and schemas open concurrently in tabs.
 *
 * ### Architectural Features
 * - **WAI-ARIA Pattern**: `nav` container with `aria-label` and `aria-current="page"` on the active tab.
 * - **Dismissible & Dirty State**: Visual dot indicator for unsaved editor changes, dismiss `X` button.
 * - **Rich ReactNode Icons**: Supports Lucide SVG icons matching Developer Platform entity types.
 */
const meta: Meta<typeof DocumentTabBar> = {
  title: "Core/Navigation/DocumentTabBar",
  component: DocumentTabBar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Multi-document workspace tab bar with dirty indicators, dismissible tabs, and new tab trigger.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Visual density tier",
    },
    tabs: {
      control: "object",
      description: "List of tab items with id, title, icon, and dirty state",
    },
    onNewTab: {
      action: "newTabClicked",
      description: "Callback invoked when '+' button is pressed",
    },
    onSelectTab: {
      action: "tabSelected",
      description: "Callback invoked when a tab is selected",
    },
    onCloseTab: {
      action: "tabClosed",
      description: "Callback invoked when a tab close button is clicked",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DocumentTabBar>;

export const Default: Story = {
  render: (args) => {
    const [activeId, setActiveId] = useState("projects");
    return (
      <DocumentTabBar
        {...args}
        tabs={visualProjectTabs}
        activeTabId={activeId}
        onSelectTab={setActiveId}
      />
    );
  },
  args: {
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => {
    const [activeId, setActiveId] = useState("supplier_exp");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", padding: "var(--space-md)" }}>
        <div style={{ padding: "var(--space-md)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "bold", color: "var(--color-fg-muted)", marginBottom: "var(--space-xs)" }}>
            ANATOMY: TAB ITEMS (ICON, TITLE, DIRTY DOT, DISMISS BTN) / NEW TAB TRIGGER
          </div>
          <DocumentTabBar
            tabs={visualProjectTabs}
            activeTabId={activeId}
            onSelectTab={setActiveId}
            onNewTab={() => {}}
          />
        </div>
      </div>
    );
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)", padding: "var(--space-md)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Compact Mode (Default Studio Tab Bar)
        </h4>
        <DocumentTabBar
          tabs={visualProjectTabs}
          initialActiveTabId="supplier_portal"
          density="compact"
          onNewTab={() => {}}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Ultra-Compact Mode
        </h4>
        <DocumentTabBar
          tabs={visualProjectTabs}
          initialActiveTabId="corp_website"
          density="ultra-compact"
          onNewTab={() => {}}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Comfortable Mode (Touch-friendly)
        </h4>
        <DocumentTabBar
          tabs={visualProjectTabs}
          initialActiveTabId="projects"
          density="comfortable"
          onNewTab={() => {}}
        />
      </div>
    </div>
  ),
};
