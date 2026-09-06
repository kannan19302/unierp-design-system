import type { Meta, StoryObj } from "@storybook/react";
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
        diffSummary:
          "- spec.replicas: 4\n+ spec.replicas: 8 (desired in git commit 8f2a91b)",
        children: [
          {
            id: "pod-1",
            name: "unierp-api-service-7f69df-w2q1a",
            kind: "Pod",
            namespace: "production",
            syncStatus: "Synced",
            healthStatus: "Healthy",
          },
          {
            id: "pod-2",
            name: "unierp-api-service-7f69df-9px0l",
            kind: "Pod",
            namespace: "production",
            syncStatus: "Synced",
            healthStatus: "Healthy",
          },
        ],
      },
      {
        id: "svc-api",
        name: "unierp-api-cluster-ip",
        kind: "Service",
        namespace: "production",
        syncStatus: "Synced",
        healthStatus: "Healthy",
      },
      {
        id: "ing-api",
        name: "unierp-api-ingress-tls",
        kind: "Ingress",
        namespace: "production",
        syncStatus: "Synced",
        healthStatus: "Healthy",
      },
      {
        id: "cm-env",
        name: "unierp-api-runtime-config",
        kind: "ConfigMap",
        namespace: "production",
        syncStatus: "Synced",
        healthStatus: "Healthy",
      },
    ],
  },
];

const meta: Meta<typeof GitOpsDeploymentSyncTree> = {
  title: "Data Display/GitOpsDeploymentSyncTree",
  component: GitOpsDeploymentSyncTree,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: { type: "select" },
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof GitOpsDeploymentSyncTree>;

export const Default: Story = {
  args: {
    appName: "unierp-platform-production",
    gitRepo: "github.com/unierp/platform-infra",
    gitRevision: "main (8f2a91b)",
    targetCluster: "aws-eks-us-east-1-prod",
    rootNodes: sampleTree,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
