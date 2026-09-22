import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BpmnSimulationBar,
  type SimulationStatus,
  type SimulationSpeed,
} from "./bpmn-simulation-bar";

const meta: Meta<typeof BpmnSimulationBar> = {
  title: "Workflow/BpmnSimulationBar",
  component: BpmnSimulationBar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
  argTypes: {
    status: {
      control: "select",
      options: ["idle", "running", "paused", "completed"],
      description: "Execution playback state",
    },
    slaStatus: {
      control: "select",
      options: ["compliant", "warning", "breached"],
      description: "SLA status indicator",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BpmnSimulationBar>;

const SAMPLE_STEPS = [
  { id: "s1", name: "Create Purchase Order", duration: "0.4s", type: "auto" as const },
  { id: "s2", name: "Procurement Manager Approval", duration: "18h", type: "human" as const },
  { id: "s3", name: "Budget Compliance Check", duration: "1.2s", type: "auto" as const },
  { id: "s4", name: "ERP Ledger Journal Post", duration: "0.8s", type: "auto" as const },
  { id: "s5", name: "Vendor EDI Confirmation", duration: "2h", type: "auto" as const },
];

const SimulationInteractiveDemo = () => {
  const [status, setStatus] = useState<SimulationStatus>("idle");
  const [speed, setSpeed] = useState<SimulationSpeed>(1);
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ padding: "var(--space-6)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-lg)" }}>
        <h4 style={{ margin: "0 0 var(--space-2) 0" }}>Purchase Requisition Process Simulation</h4>
        <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
          Simulating real-world human turnaround and automated task latency based on historical telemetry.
        </p>
      </div>

      <BpmnSimulationBar
        status={status}
        onPlay={() => setStatus("running")}
        onPause={() => setStatus("paused")}
        onStep={() => setActiveStep((prev) => (prev + 1) % SAMPLE_STEPS.length)}
        onReset={() => {
          setStatus("idle");
          setActiveStep(0);
        }}
        speed={speed}
        onChangeSpeed={setSpeed}
        totalDuration="20h 1m 2.4s"
        slaStatus="compliant"
        slaLabel="SLA Target: < 24h (Compliant)"
        activeStepIndex={activeStep}
        steps={SAMPLE_STEPS}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <SimulationInteractiveDemo />,
};

export const BreachedSla: Story = {
  render: () => (
    <BpmnSimulationBar
      status="completed"
      onPlay={() => {}}
      onPause={() => {}}
      onReset={() => {}}
      totalDuration="6d 14h"
      slaStatus="breached"
      slaLabel="SLA Target: < 5d (BREACHED)"
      activeStepIndex={4}
      steps={SAMPLE_STEPS}
    />
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        <strong>BpmnSimulationBar Anatomy:</strong>
        <ol style={{ margin: "var(--space-2) 0", paddingInlineStart: "var(--space-4)" }}>
          <li>Playback Controls (Simulate/Pause, Step Forward, Reset)</li>
          <li>Speed Multipliers (1x, 2x, 5x, 10x acceleration)</li>
          <li>Duration Metric (Sum of automated task compute and human delay)</li>
          <li>SLA Badge (Compliant, Warning, Breached indicator pill)</li>
          <li>Step Sequence Breakdown (Ordered node pills with passed/current/pending states)</li>
        </ol>
      </div>
      <SimulationInteractiveDemo />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Idle State</h4>
        <BpmnSimulationBar
          status="idle"
          onPlay={() => {}}
          onPause={() => {}}
          onReset={() => {}}
          totalDuration="0s"
          slaStatus="compliant"
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Running with Step Sequence</h4>
        <SimulationInteractiveDemo />
      </div>
    </div>
  ),
};
