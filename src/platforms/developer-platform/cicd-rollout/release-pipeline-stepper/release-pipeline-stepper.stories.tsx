import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ReleasePipelineStepper,
  type ReleaseStage,
} from "./release-pipeline-stepper";

const meta: Meta<typeof ReleasePipelineStepper> = {
  title: "Platforms/DeveloperPlatform/CICD/ReleasePipelineStepper",
  component: ReleasePipelineStepper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ReleasePipelineStepper>;

const SAMPLE_STAGES: ReleaseStage[] = [
  {
    id: "stage-dev",
    name: "Development",
    environment: "dev.unierp.internal",
    status: "success",
    version: "v2.5.0-alpha.12",
    commitSha: "8f24a1c",
    duration: "4m 12s",
  },
  {
    id: "stage-test",
    name: "Automated Test",
    environment: "ci-runner-eu-west-1",
    status: "success",
    version: "v2.5.0-alpha.12",
    commitSha: "8f24a1c",
    duration: "12m 45s",
  },
  {
    id: "stage-staging",
    name: "Quality Staging",
    environment: "stage.app.unierp.com",
    status: "running",
    version: "v2.5.0-rc.1",
    commitSha: "8f24a1c",
    duration: "Deploying...",
  },
  {
    id: "stage-prod",
    name: "Production Multi-Tenant",
    environment: "app.unierp.com",
    status: "awaiting_approval",
    version: "v2.5.0",
    commitSha: "8f24a1c",
  },
];

const StepperInteractiveDemo = () => {
  const [selectedId, setSelectedId] = useState("stage-staging");
  const [stages, setStages] = useState(SAMPLE_STAGES);

  const handlePromote = (stage: ReleaseStage) => {
    alert(`Promotion approved for ${stage.name}! Deployment initiated.`);
    setStages((prev) =>
      prev.map((s) =>
        s.id === stage.id ? { ...s, status: "running" as const, duration: "Deploying..." } : s,
      ),
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div style={{ padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-1) 0" }}>Release Pipeline: Portal Core v2.5.0</h4>
        <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
          Strict multi-environment promotion path enforcing automated unit, integration, and security gates.
        </p>
      </div>

      <ReleasePipelineStepper
        stages={stages}
        selectedStageId={selectedId}
        onSelectStage={(s) => setSelectedId(s.id)}
        onPromoteStage={handlePromote}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <StepperInteractiveDemo />,
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        <strong>ReleasePipelineStepper Anatomy:</strong>
        <ol style={{ margin: "var(--space-2) 0", paddingInlineStart: "var(--space-4)" }}>
          <li>Stage Cards (Environment name, status pill, target URL, commit hash)</li>
          <li>Animated Connector Tracks (Color-coded lines with directional arrows)</li>
          <li>In-Progress Spinner for Active Deployments</li>
          <li>Separation-of-Duties Promotion Gate Button (Awaiting Approval)</li>
        </ol>
      </div>
      <StepperInteractiveDemo />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>All Passing Pipeline</h4>
        <ReleasePipelineStepper
          stages={[
            { id: "1", name: "Build", environment: "runner-1", status: "success", version: "v1.0", duration: "1m" },
            { id: "2", name: "Test", environment: "runner-2", status: "success", version: "v1.0", duration: "3m" },
            { id: "3", name: "Production", environment: "prod.cloud", status: "success", version: "v1.0", duration: "Live" },
          ]}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Failed Quality Gate</h4>
        <ReleasePipelineStepper
          stages={[
            { id: "1", name: "Build", environment: "runner-1", status: "success", version: "v1.1", duration: "1m" },
            { id: "2", name: "End-to-End Tests", environment: "runner-2", status: "failed", version: "v1.1", duration: "Failed (3 broken)" },
            { id: "3", name: "Production", environment: "prod.cloud", status: "pending", version: "v1.1" },
          ]}
        />
      </div>
    </div>
  ),
};
