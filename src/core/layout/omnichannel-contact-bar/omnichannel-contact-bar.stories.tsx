import type { Meta, StoryObj } from "@storybook/react";
import {
  OmnichannelContactBar,
  type CallerProfile,
} from "./omnichannel-contact-bar";

const mockCaller: CallerProfile = {
  callerNumber: "+1 (415) 890-2134",
  customerName: "AeroDynamics Propulsion Corp",
  accountReference: "ACC-88201",
  serviceTier: "Mission-Critical 24/7",
};

const meta: Meta<typeof OmnichannelContactBar> = {
  title: "Layout/OmnichannelContactBar",
  component: OmnichannelContactBar,
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OmnichannelContactBar>;

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ padding: "16px", background: "var(--color-bg-subtle)", minBlockSize: "200px" }}>
      <OmnichannelContactBar {...args} />
    </div>
  ),
  args: {
    initialState: "in_call",
    activeCaller: mockCaller,
    callDurationSeconds: 258,
    variant: "docked",
    density: "compact",
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "16px", background: "var(--color-bg-subtle)" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>In-Call State (Docked)</h4>
        <OmnichannelContactBar
          initialState="in_call"
          activeCaller={mockCaller}
          callDurationSeconds={312}
          variant="docked"
          density="compact"
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Wrap-Up Stage with Disposition Selector</h4>
        <OmnichannelContactBar
          initialState="wrap_up"
          activeCaller={mockCaller}
          variant="docked"
          density="compact"
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Available / Standby Ready State</h4>
        <OmnichannelContactBar
          initialState="available"
          variant="docked"
          density="compact"
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Floating CTI Bar (Ultra-Compact)</h4>
        <OmnichannelContactBar
          initialState="in_call"
          activeCaller={mockCaller}
          callDurationSeconds={45}
          variant="floating"
          density="ultra-compact"
        />
      </div>
    </div>
  ),
};

export const Default: Story = {
  ...AnatomyAndComposition,
};

