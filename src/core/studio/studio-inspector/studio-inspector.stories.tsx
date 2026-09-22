import type { Meta, StoryObj } from "@storybook/react";
import { MoreHorizontal, Layers, Database } from "lucide-react";
import { StudioInspector } from "./studio-inspector";

/**
 * `StudioInspector` provides the right-hand properties configuration drawer in Developer Platform builders,
 * displaying element badges, action menus, customizable tabs, and property field groups.
 *
 * ### Architectural Features
 * - **Domain Custom Tabs**: Renders builder-specific tab sets (`Settings`/`Styles`, `Properties`/`Data`/`Events`, etc.).
 * - **Header Element Identity**: Highlights current selection with icon, title, and action menu.
 * - **WAI-ARIA Pattern**: Complete `tablist` and `tabpanel` semantics with keyboard arrow navigation.
 */
const meta: Meta<typeof StudioInspector> = {
  title: "Studio/StudioInspector",
  component: StudioInspector,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    subject: {
      control: "text",
      description: "Name of the element currently selected on canvas",
    },
    headerBadge: {
      control: "text",
      description: "Optional element classification badge",
    },
  },
};

export default meta;
type Story = StoryObj<typeof StudioInspector>;

export const Default: Story = {
  args: {
    subject: "Hero",
    headerIcon: <Layers size={14} />,
    headerBadge: "Banner",
    actionMenu: <button type="button" style={{ border: "none", background: "transparent", cursor: "pointer" }}><MoreHorizontal size={14} /></button>,
    customTabs: [
      {
        id: "settings",
        label: "Settings",
        content: (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div>
              <label style={{ display: "block", fontSize: "var(--font-size-xs)", fontWeight: 600, marginBottom: "var(--space-xs)" }}>
                Layout Grid
              </label>
              <select style={{ width: "100%", padding: "var(--space-xs)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                <option>2 columns</option>
                <option>3 columns</option>
                <option>1 column full</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--font-size-xs)", fontWeight: 600, marginBottom: "var(--space-xs)" }}>
                Gap
              </label>
              <input type="text" defaultValue="32px" style={{ width: "100%", padding: "var(--space-xs)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }} />
            </div>
          </div>
        ),
      },
      {
        id: "styles",
        label: "Styles",
        content: (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <label style={{ display: "block", fontSize: "var(--font-size-xs)", fontWeight: 600 }}>Typography Heading</label>
            <input type="text" defaultValue="Inter" style={{ width: "100%", padding: "var(--space-xs)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }} />
          </div>
        ),
      },
    ],
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ maxWidth: 360, height: 480, border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
      <StudioInspector
        subject="supplierTable"
        headerIcon={<Database size={14} />}
        headerBadge="Table"
        actionMenu={<button type="button" style={{ border: "none", background: "transparent", cursor: "pointer" }}><MoreHorizontal size={14} /></button>}
        customTabs={[
          {
            id: "properties",
            label: "Properties",
            content: (
              <div style={{ fontSize: "var(--font-size-xs)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                <div><strong>ID:</strong> supplierTable</div>
                <div><strong>Type:</strong> Table</div>
                <div><strong>Source:</strong> suppliers.list</div>
              </div>
            ),
          },
          {
            id: "data",
            label: "Data",
            content: <div style={{ fontSize: "var(--font-size-xs)" }}>Bound to query: suppliers.list</div>,
          },
          {
            id: "events",
            label: "Events",
            content: <div style={{ fontSize: "var(--font-size-xs)" }}>onRowClick: openDetailModal</div>,
          },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-lg)", flexWrap: "wrap" }}>
      <div style={{ width: 320, height: 380, border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "var(--space-xs) var(--space-md)", fontSize: "var(--font-size-xs)", color: "var(--color-fg-muted)" }}>
          Populated Element Inspector (Website Builder)
        </h4>
        <StudioInspector
          subject="Hero"
          headerBadge="Banner"
          customTabs={[
            { id: "settings", label: "Settings", content: <div>Layout: 2 columns</div> },
            { id: "styles", label: "Styles", content: <div>Font: Inter 700</div> },
          ]}
        />
      </div>

      <div style={{ width: 320, height: 380, border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "var(--space-xs) var(--space-md)", fontSize: "var(--font-size-xs)", color: "var(--color-fg-muted)" }}>
          Nothing Selected (Empty State)
        </h4>
        <StudioInspector />
      </div>
    </div>
  ),
};
