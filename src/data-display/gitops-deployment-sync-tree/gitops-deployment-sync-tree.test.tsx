import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  GitOpsDeploymentSyncTree,
  GitOpsResourceNode,
} from "./gitops-deployment-sync-tree";

const sampleTree: GitOpsResourceNode[] = [
  {
    id: "ns-prod",
    name: "production",
    kind: "Namespace",
    syncStatus: "Synced",
    healthStatus: "Healthy",
    children: [
      {
        id: "deploy-api",
        name: "unierp-api-service",
        kind: "Deployment",
        namespace: "production",
        syncStatus: "OutOfSync",
        healthStatus: "Progressing",
        diffSummary: "- spec.replicas: 4\n+ spec.replicas: 8",
      },
    ],
  },
];

describe("GitOpsDeploymentSyncTree", () => {
  it("renders cluster header, namespaces, and child deployment nodes", () => {
    render(
      <GitOpsDeploymentSyncTree
        appName="unierp-platform-production"
        gitRepo="github.com/unierp/platform-infra"
        gitRevision="main"
        targetCluster="aws-eks-us-east-1-prod"
        rootNodes={sampleTree}
      />
    );

    expect(screen.getByText("unierp-platform-production")).toBeDefined();
    expect(screen.getByText("aws-eks-us-east-1-prod")).toBeDefined();
    expect(screen.getByText("production")).toBeDefined();
    expect(screen.getByText("unierp-api-service")).toBeDefined();
  });

  it("invokes onSyncNode callback when sync button is clicked", () => {
    const handleSyncNode = vi.fn();

    render(
      <GitOpsDeploymentSyncTree
        appName="unierp-platform-production"
        gitRepo="github.com/unierp/platform-infra"
        gitRevision="main"
        targetCluster="aws-eks-us-east-1-prod"
        rootNodes={sampleTree}
        onSyncNode={handleSyncNode}
      />
    );

    const syncBtn = screen.getByRole("button", {
      name: /Sync unierp-api-service to live cluster/i,
    });
    fireEvent.click(syncBtn);

    expect(handleSyncNode).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <GitOpsDeploymentSyncTree
        appName="unierp-platform-production"
        gitRepo="github.com/unierp/platform-infra"
        gitRevision="main"
        targetCluster="aws-eks-us-east-1-prod"
        rootNodes={sampleTree}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
