import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FeatureRolloutSlider } from "./feature-rollout-slider";

/**
 * `FeatureRolloutSlider` manages enterprise feature flag rollouts with continuous traffic percentages,
 * stepped canary milestones (e.g. 5% canary, 25% beta), live audience sizing, and a one-click emergency killswitch.
 *
 * ### Architectural Features
 * - **WAI-ARIA Slider**: `role="slider"` with keyboard step adjustments (Arrow keys, Home, End).
 * - **Canary Presets**: Quick buttons to jump to predetermined staging phases.
 * - **Emergency Killswitch**: Overrides traffic to 0% with warning color affordances.
 */
const meta: Meta<typeof FeatureRolloutSlider> = {
  title: "Platforms/DeveloperPlatform/CicdRollout/FeatureRolloutSlider",
  component: FeatureRolloutSlider,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Enterprise feature rollout and canary traffic slider with audience calculations and emergency killswitch.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    flagKey: {
      control: "text",
      description: "Identifier or telemetry key of the feature flag",
    },
    description: {
      control: "text",
      description: "Explanation of the feature functionality and impact",
    },
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Rollout traffic percentage (0-100)",
    },
    totalAudience: {
      control: "number",
      description: "Estimated total population or tenant count",
    },
    audienceUnit: {
      control: "text",
      description: "Label for audience metric (e.g. tenants, users)",
    },
    isKillswitchActive: {
      control: "boolean",
      description: "Whether emergency killswitch is engaged (forcing 0% traffic)",
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction with slider and presets",
    },
    onChange: {
      action: "percentageChanged",
      description: "Callback invoked when traffic percentage changes",
    },
    onKillswitchToggle: {
      action: "killswitchToggled",
      description: "Callback invoked when killswitch status changes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FeatureRolloutSlider>;

export const Default: Story = {
  render: (args) => {
    const [val, setVal] = useState(args.value ?? 25);
    const [killswitch, setKillswitch] = useState(args.isKillswitchActive ?? false);
    return (
      <div style={{ maxWidth: 640 }}>
        <FeatureRolloutSlider
          {...args}
          value={val}
          onChange={setVal}
          isKillswitchActive={killswitch}
          onKillswitchToggle={setKillswitch}
        />
      </div>
    );
  },
  args: {
    flagKey: "finance_realtime_ledger_stream",
    description: "Enables sub-second distributed Kafka event sync for high-volume transactions",
    value: 25,
    totalAudience: 12500,
    audienceUnit: "tenants",
    isKillswitchActive: false,
    disabled: false,
  },
};

export const GeneralAvailability: Story = {
  args: {
    flagKey: "strata_unified_command_k",
    description: "Global keyboard shortcut indexing across 15 enterprise verticals",
    value: 100,
    totalAudience: 85000,
    audienceUnit: "active seats",
  },
};

export const EmergencyKillswitchEngaged: Story = {
  args: {
    flagKey: "experimental_ai_tax_reconciler",
    description: "Autonomous journal entry tax reconciler with OpenAI function calls",
    value: 50,
    totalAudience: 4000,
    audienceUnit: "business entities",
    isKillswitchActive: true,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => {
    const [val, setVal] = useState(10);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", maxWidth: 640 }}>
        <div style={{ padding: "var(--space-md)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "bold", color: "var(--color-fg-muted)", marginBottom: "var(--space-xs)" }}>
            ANATOMY: FLAG HEADER & KILLSWITCH / SLIDER TRACK & THUMB / CANARY PRESETS
          </div>
          <FeatureRolloutSlider
            flagKey="inventory_autonomous_reorder"
            description="Automated purchase order dispatch when stock hits safety thresholds"
            value={val}
            onChange={setVal}
            totalAudience={5000}
          />
        </div>
      </div>
    );
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)", maxWidth: 640 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Canary Pilot (5%)
        </h4>
        <FeatureRolloutSlider
          flagKey="billing_v3_engine"
          description="Next-gen multi-currency rating engine"
          value={5}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Full General Availability (100%)
        </h4>
        <FeatureRolloutSlider
          flagKey="sso_saml_v2"
          description="Enterprise single sign-on federation"
          value={100}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Killswitch Engaged (Forced 0%)
        </h4>
        <FeatureRolloutSlider
          flagKey="legacy_ftp_export"
          description="Legacy batch export service"
          value={40}
          isKillswitchActive={true}
        />
      </div>
    </div>
  ),
};
