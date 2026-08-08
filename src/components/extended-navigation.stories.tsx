import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb, CommandPalette, Steps } from "./extended-navigation";

const meta: Meta = {
  title: "Components/ExtendedNavigation",
};

export default meta;

export const BreadcrumbDefault: StoryObj = {
  render: () => (
    <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Settings" }]} />
  ),
};

export const CommandPaletteDefault: StoryObj = {
  render: () => (
    <CommandPalette
      open={true}
      onClose={() => {}}
      items={[
        { id: "1", title: "Dashboard", category: "Navigation", onSelect: () => {} },
        { id: "2", title: "Create User", category: "Actions", onSelect: () => {} },
      ]}
    />
  ),
};

export const StepsDefault: StoryObj = {
  render: () => (
    <Steps
      current={1}
      items={[
        { title: "Account Info" },
        { title: "Personal Details" },
        { title: "Confirmation" },
      ]}
    />
  ),
};
