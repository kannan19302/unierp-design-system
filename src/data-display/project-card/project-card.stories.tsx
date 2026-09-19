import type { Meta, StoryObj } from "@storybook/react";
import { ProjectCard, type ProjectType, type ProjectStatus } from "./project-card";

const meta: Meta<typeof ProjectCard> = {
  title: "Data Display/ProjectCard",
  component: ProjectCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["website", "app", "workflow", "api", "component"],
      description: "Project category archetype",
    },
    status: {
      control: "select",
      options: ["live", "draft", "review", "archived"],
      description: "Lifecycle deployment status",
    },
    title: {
      control: "text",
      description: "Project name",
    },
    description: {
      control: "text",
      description: "Project narrative description",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProjectCard>;

export const Default: Story = {
  args: {
    id: "proj-001",
    title: "Supplier Experience Portal",
    description: "Enterprise vendor portal for self-service onboarding, PO acknowledgments, and invoice reconciliation.",
    type: "app",
    status: "live",
    version: "v2.4.1",
    lastUpdated: "Updated 2h ago",
    author: { name: "Sarah Chen" },
    onClick: () => alert("Card clicked"),
    onOpen: () => alert("Open Studio clicked"),
  },
};

export const WebsiteProject: Story = {
  args: {
    id: "proj-002",
    title: "Corporate Website & Brand Hub",
    description: "Public-facing marketing website powered by Headless CMS, multi-locale localization, and SEO tags.",
    type: "website",
    status: "live",
    version: "v3.1.0",
    lastUpdated: "Updated yesterday",
    author: { name: "Marcus Vance" },
  },
};

export const WorkflowProject: Story = {
  args: {
    id: "proj-003",
    title: "Capex Approval Routing Engine",
    description: "Multi-tier BPMN 2.0 financial approval workflow with automated delegation and ERP ledger posting.",
    type: "workflow",
    status: "review",
    version: "v1.0.0-rc2",
    lastUpdated: "Updated 15m ago",
    author: { name: "Elena Rostova" },
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxInlineSize: "640px" }}>
      <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        <strong>ProjectCard Anatomy:</strong>
        <ol style={{ margin: "var(--space-2) 0", paddingInlineStart: "var(--space-4)" }}>
          <li>Icon Box (Visual archetype identity: App, Website, Workflow, API)</li>
          <li>Badge Row (Category badge + Lifecycle status indicator with colored dot)</li>
          <li>Title & Multi-line Clamped Description</li>
          <li>Footer (Version pill, relative timestamp, author attribution)</li>
          <li>Direct Open Action (Keyboard accessible studio entry button)</li>
        </ol>
      </div>
      <ProjectCard
        id="anatomy-demo"
        title="Supplier Experience Portal"
        description="Enterprise vendor portal for self-service onboarding, PO acknowledgments, and invoice reconciliation."
        type="app"
        status="live"
        version="v2.4.1"
        lastUpdated="Updated 2h ago"
        author={{ name: "Sarah Chen" }}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => {
    const types: ProjectType[] = ["website", "app", "workflow", "api"];
    const statuses: ProjectStatus[] = ["live", "draft", "review", "archived"];

    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-4)" }}>
        {types.map((type, idx) => (
          <ProjectCard
            key={type}
            id={`gallery-${type}`}
            title={`${type.toUpperCase()} Demo Workspace`}
            description={`Complete configuration and deployment pipeline for the enterprise ${type} workload.`}
            type={type}
            status={statuses[idx % statuses.length]}
            version={`v1.${idx}.0`}
            lastUpdated={`${idx + 1}d ago`}
            author={{ name: "Engineering Team" }}
            onClick={() => console.log(`Selected ${type}`)}
          />
        ))}
      </div>
    );
  },
};
