import type { Meta, StoryObj } from "@storybook/react";
import {
  OmnichannelContactBar,
  CallerProfile,
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
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OmnichannelContactBar>;

export const InCall: Story = {
  args: {
    initialState: "in_call",
    activeCaller: mockCaller,
    callDurationSeconds: 258,
    variant: "docked",
    density: "compact",
  },
};

export const Floating: Story = {
  args: {
    ...InCall.args,
    variant: "floating",
  },
};

export const WrapUp: Story = {
  args: {
    initialState: "wrap_up",
    activeCaller: mockCaller,
    variant: "docked",
  },
};

export const Available: Story = {
  args: {
    initialState: "available",
    variant: "docked",
  },
};
