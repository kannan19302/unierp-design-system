import type { Preview } from "@storybook/react";
import "@kannan19302/ui/tokens/index.css";
import "@kannan19302/ui/tokens/v2/index.css";
import "@kannan19302/ui/tokens/v3/index.css";
import "@kannan19302/ui/styles/fonts.css";
import "@kannan19302/ui/styles/globals.css";


const THEMES = [
  { value: "strata", title: "Strata (Flagship Light Default)" },
  { value: "strata-dark", title: "Strata Dark (Obsidian Tactical Default)" },
  { value: "strata-high-contrast", title: "Strata High Contrast (WCAG AAA 21:1)" },
  { value: "meridian", title: "Meridian (Legacy Light)" },
  { value: "meridian-dark", title: "Meridian Dark (Legacy Dark)" },
  { value: "high-contrast", title: "Legacy High Contrast" },
];

const DENSITIES = [
  { value: "ultra-compact", title: "Ultra-Compact (24px Ledgers & High-Density)" },
  { value: "compact", title: "Compact (28px Expert Queues)" },
  { value: "standard", title: "Standard (32px Enterprise Default)" },
  { value: "comfortable", title: "Comfortable (40px Touch & Dashboards)" },
];

const PLATFORMS = [
  { value: "apps", title: "Tenant Apps (Emerald)" },
  { value: "tenant-admin", title: "Tenant Admin (Royal Blue)" },
  { value: "platform-admin", title: "Platform Admin (Deep Purple)" },
  { value: "developer", title: "Developer Console (Indigo)" },
  { value: "ops", title: "Operations OS (Rust / Amber)" },
  { value: "marketing", title: "Corporate / Marketing (Teal)" },
  { value: "marketplace", title: "Marketplace (Violet)" },
  { value: "website", title: "Web Studio (Cobalt)" },
];

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          "Core",
          [
            "Theme",
            "Brand",
            "Primitives",
            "Inputs",
            "Overlays",
            "Navigation",
            "DataDisplay",
            "DataGrid",
            "Forms",
            "Layout",
            "Shell",
            "Studio",
            "Dashboard",
            "Charts",
            "Feedback",
            "Workflow",
            "*",
          ],
          "Platforms",
          [
            "BusinessSuite",
            "DeveloperPlatform",
            "Identity",
            "Marketing",
            "TenantAdmin",
            "ProviderAdmin",
            "Sites",
            "Marketplace",
            "Mobile",
            "Desktop",
            "*",
          ],
          "*",
        ],
      },
    },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
      expanded: true,
      sort: "requiredFirst",
    },
    docs: {
      toc: true,
    },
    layout: "centered",
    backgrounds: { disable: true },
  },
  globalTypes: {
    theme: {
      description: "UniERP Design Language 2.0 Theme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: THEMES,
        dynamicTitle: true,
      },
    },
    density: {
      description: "Information Density Matrix",
      toolbar: {
        title: "Density",
        icon: "collapse",
        items: DENSITIES,
        dynamicTitle: true,
      },
    },
    platform: {
      description: "Platform Accent Identity",
      toolbar: {
        title: "Platform",
        icon: "globe",
        items: PLATFORMS,
        dynamicTitle: true,
      },
    },
    direction: {
      description: "Text Direction (BiDi / RTL)",
      toolbar: {
        title: "Direction",
        icon: "transfer",
        items: [
          { value: "ltr", title: "LTR (Left-to-Right)" },
          { value: "rtl", title: "RTL (Right-to-Left)" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "strata",
    density: "standard",
    platform: "apps",
    direction: "ltr",
  },
  decorators: [
    (Story, context) => {
      const currentTheme = context.globals.theme ?? "strata";
      const currentDensity = context.globals.density ?? "standard";
      const currentPlatform = context.globals.platform ?? "apps";
      const currentDirection = context.globals.direction ?? "ltr";

      document.documentElement.setAttribute("data-theme", currentTheme);
      document.documentElement.setAttribute("data-density", currentDensity);
      document.documentElement.setAttribute("data-platform", currentPlatform);
      document.documentElement.setAttribute("dir", currentDirection);

      return Story();
    },
  ],
};

export default preview;
