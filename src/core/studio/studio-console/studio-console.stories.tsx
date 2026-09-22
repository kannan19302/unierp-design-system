import type { Meta, StoryObj } from "@storybook/react";
import { StudioConsole, type StudioProblem } from "./studio-console";

const MOCK_PROBLEMS: StudioProblem[] = [
  {
    id: "p1",
    severity: "error",
    message: "Missing mandatory form action endpoint",
    where: "Lead Capture Form",
    targetId: "form-01",
  },
  {
    id: "p2",
    severity: "warning",
    message: "Image asset is missing an alt description",
    where: "Hero Banner",
    targetId: "hero-img",
  },
  {
    id: "p3",
    severity: "info",
    message: "CSS subgrid layout auto-applied",
    where: "Grid Container",
    targetId: "grid-02",
  },
];

const meta: Meta<typeof StudioConsole> = {
  title: "Studio/StudioConsole",
  component: StudioConsole,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StudioConsole>;

export const Expanded: Story = {
  args: {
    problems: MOCK_PROBLEMS,
    defaultOpen: true,
    output: "Compilation completed in 184ms. 1 error, 1 warning, 1 info.",
  },
};

export const Collapsed: Story = {
  args: {
    problems: MOCK_PROBLEMS,
    defaultOpen: false,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0", color: "var(--color-text-primary)" }}>
          Studio Diagnostic Console
        </h4>
        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          The bottom drawer informs developers of active compilation diagnostics, errors, warnings, and test runner outputs.
        </p>
      </div>
      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <StudioConsole
          problems={MOCK_PROBLEMS}
          defaultOpen={true}
          output="[vite] vite v5.4.15 building for production...\n✓ 42 modules transformed.\ndist/index.js   12.4 kB"
          logs={
            <div style={{ padding: "var(--space-3)", fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)" }}>
              [12:45:01] EXT_START: UniERP Workflow Engine initialized.
            </div>
          }
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h5 style={{ margin: "0 0 var(--space-2) 0", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}>
          Clean State (No Errors)
        </h5>
        <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
          <StudioConsole problems={[]} defaultOpen={true} output="No warnings or errors reported." />
        </div>
      </div>
      <div>
        <h5 style={{ margin: "0 0 var(--space-2) 0", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}>
          Active Errors & Warnings
        </h5>
        <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
          <StudioConsole problems={MOCK_PROBLEMS} defaultOpen={true} />
        </div>
      </div>
    </div>
  ),
};
