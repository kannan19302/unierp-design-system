import type { Meta, StoryObj } from "@storybook/react";
import { SideNav } from "./sidebar";
import { SidebarReference } from "../../../storybook/fixtures/sidebar-reference";
import styles from "./sidebar.module.css";

const meta: Meta<typeof SideNav> = {
  title: "Navigation/Sidenav",
  component: SideNav,
  tags: ["autodocs"],
  parameters: { a11y: { test: "error" } },
  argTypes: {
    density: { control: "select", options: ["ultra-compact", "compact", "standard", "comfortable"], description: "Strata density tier for the sidebar navigation." },
    collapsed: { control: "boolean", description: "Whether the sidebar is collapsed into an icon rail." },
    searchable: { control: "boolean", description: "Enables interactive fast filtering across navigation items." },
    allowFavorites: { control: "boolean", description: "Enables pin-to-top star actions for items." },
  },
};
export default meta;
type Story = StoryObj<typeof SideNav>;
export const V1WorkspacePreview: Story = {
  name: "V1 sidebar reference",
  render: () => <SidebarReference />,
  parameters: { layout: "fullscreen", controls: { disable: true }, options: { showPanel: false } },
};

export const V1TeamMenu: Story = {
  name: "V1 team switcher",
  render: () => <SidebarReference initialMenu="team" />,
  parameters: { layout: "fullscreen", controls: { disable: true }, options: { showPanel: false } },
};

export const V1AccountMenu: Story = {
  name: "V1 account menu",
  render: () => <SidebarReference initialMenu="account" />,
  parameters: { layout: "fullscreen", controls: { disable: true }, options: { showPanel: false } },
};

export const V1InsetAndVariants: Story = {
  name: "V1 inset and variants",
  render: () => <SidebarReference initialVariant="inset" showSkeleton showVariants />,
  parameters: { layout: "fullscreen", controls: { disable: true }, options: { showPanel: false } },
};

export const V1CustomizeSidebar: Story = {
  name: "V1 customize sidebar",
  render: () => <SidebarReference initialCustomize />,
  parameters: { layout: "fullscreen", controls: { disable: true }, options: { showPanel: false } },
};

export const StateMatrix: Story = {
  name: "V1 state matrix",
  render: () => (
    <main className={styles.storyStateMatrix}>
      {(["sidebar", "icon", "inset", "floating"] as const).map((variant) => (
        <section key={variant}>
          <h2>{variant === "sidebar" ? "Default" : variant === "icon" ? "Icon rail" : variant === "inset" ? "Inset" : "Floating"}</h2>
          <SidebarReference initialVariant={variant} showVariants showSkeleton embedded landmarkLabel={`${variant} side navigation`} />
        </section>
      ))}
    </main>
  ),
  parameters: { layout: "fullscreen", controls: { disable: true }, options: { showPanel: false } },
};
