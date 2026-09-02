import type { Meta, StoryObj } from "@storybook/react";
import {
  AlignLeft,
  CalendarDays,
  Hash,
  Mail,
  Rows3,
  Type as TypeIcon,
} from "lucide-react";
import { StudioShell } from "./studio-shell";
import { StudioToolbar } from "../studio-toolbar";
import { StudioPalette, type PaletteGroup } from "../studio-palette";
import { StudioCanvas } from "../studio-canvas";
import { StudioInspector } from "../studio-inspector";
import { StudioConsole } from "../studio-console";


/**
 * The Studio set is only meaningful assembled, so the stories show the whole
 * frame rather than each part in isolation. Flip the Storybook theme and
 * density toolbars over these — the chrome is the surface most likely to break
 * under `high-contrast`, because that theme collapses every subtle fill to
 * white and leaves borders carrying the entire layout.
 */
/**
 * The shell is `block-size: 100%`, and Storybook's root element is not, so a
 * plain `100vh` wrapper still collapses to content height. `position: fixed`
 * against the viewport is what actually gives the story the full frame — and
 * the full frame is the only way to see whether the canvas really holds its
 * 60%.
 */
const FullFrame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: "fixed", inset: 0 }}>{children}</div>
);

const meta: Meta<typeof StudioShell> = {
  title: "Studio/StudioShell",
  component: StudioShell,
  parameters: { layout: "fullscreen" },
  argTypes: {
    toolbar: { control: false },
    palette: { control: false },
    canvas: { control: false },
    inspector: { control: false },
    console: { control: false },
    children: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof StudioShell>;

const GROUPS: PaletteGroup[] = [
  {
    id: "inputs",
    label: "Inputs",
    items: [
      { id: "text", label: "Text field", icon: TypeIcon },
      { id: "email", label: "Email field", icon: Mail, keywords: ["mail"] },
      { id: "number", label: "Number field", icon: Hash },
      { id: "date", label: "Date picker", icon: CalendarDays },
    ],
  },
  {
    id: "layout",
    label: "Layout",
    items: [
      { id: "section", label: "Section", icon: Rows3 },
      { id: "text-block", label: "Text block", icon: AlignLeft },
      {
        id: "repeater",
        label: "Repeater",
        icon: Rows3,
        disabled: true,
        disabledReason: "Needs a data source before it can repeat over anything",
      },
    ],
  },
];

const Frame = ({
  problems = [],
  dirty = false,
  inspectorSubject,
}: {
  problems?: React.ComponentProps<typeof StudioConsole>["problems"];
  dirty?: boolean;
  inspectorSubject?: string;
}) => (
  <FullFrame>
    <StudioShell
      label="Contact form builder"
      toolbar={
        <StudioToolbar
          name="Contact form"
          kind="Form"
          version="v12 · draft"
          dirty={dirty}
          problemCount={problems?.length ?? 0}
          validate={{ onAction: () => {} }}
          preview={{ onAction: () => {} }}
          testRun={{ onAction: () => {} }}
          version_={{ onAction: () => {} }}
          publish={{ onAction: () => {} }}
        />
      }
      palette={<StudioPalette groups={GROUPS} onInsert={() => {}} />}
      canvas={
        <StudioCanvas label="Contact form layout">
          <p>The artefact renders here, in the tenant&rsquo;s semantic tokens.</p>
        </StudioCanvas>
      }
      inspector={
        <StudioInspector
          subject={inspectorSubject}
          properties={<p>Typed property editor for {inspectorSubject}.</p>}
        />
      }
      console={<StudioConsole problems={problems} onLocate={() => {}} />}
    />
  </FullFrame>
);

/** The calm default: nothing selected, nothing wrong, console collapsed. */
export const Default: Story = {
  render: () => <Frame />,
};

/** Something is selected, so the inspector has a subject and four live tabs. */
export const WithSelection: Story = {
  render: () => <Frame inspectorSubject="Email field" dirty />,
};

/** Validation found problems. The counts show on the collapsed console bar. */
export const WithProblems: Story = {
  render: () => (
    <Frame
      inspectorSubject="Email field"
      dirty
      problems={[
        {
          id: "1",
          severity: "error",
          message: "Field has no name",
          where: "Email field",
          targetId: "f1",
        },
        {
          id: "2",
          severity: "warning",
          message: "Two fields share the label “Email”",
          where: "Section 1",
          targetId: "f2",
        },
      ]}
    />
  ),
};

/**
 * Both rails collapsed to handles — what the shell does below 900px, and what
 * a user gets when they want the canvas and nothing else.
 */
export const RailsCollapsed: Story = {
  render: () => (
    <FullFrame>
      <StudioShell
        label="Contact form builder"
        defaultPaletteOpen={false}
        defaultInspectorOpen={false}
        toolbar={<StudioToolbar name="Contact form" kind="Form" />}
        palette={<StudioPalette groups={GROUPS} onInsert={() => {}} />}
        canvas={
          <StudioCanvas label="Contact form layout">
            <p>Maximum canvas. Both rails are one click away.</p>
          </StudioCanvas>
        }
        inspector={<StudioInspector />}
      />
    </FullFrame>
  ),
};
