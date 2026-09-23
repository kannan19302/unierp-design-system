import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  DnsZoneRecordEditor,
  DnsZoneRecord,
} from "./dns-zone-record-editor";

const mockRecords: DnsZoneRecord[] = [
  {
    id: "rec-1",
    type: "A",
    name: "@",
    content: "198.51.100.12",
    ttl: 1,
    proxied: true,
    status: "active",
  },
  {
    id: "rec-2",
    type: "A",
    name: "api",
    content: "198.51.100.15",
    ttl: 300,
    proxied: true,
    status: "active",
  },
  {
    id: "rec-3",
    type: "CNAME",
    name: "portal",
    content: "edge.unierp-cdn.net",
    ttl: 1,
    proxied: true,
    status: "active",
  },
  {
    id: "rec-4",
    type: "MX",
    name: "@",
    content: "mail.protonmail.ch",
    ttl: 3600,
    priority: 10,
    proxied: false,
    status: "active",
  },
  {
    id: "rec-5",
    type: "TXT",
    name: "@",
    content: "v=spf1 include:_spf.google.com ~all",
    ttl: 3600,
    status: "active",
  },
];

const meta: Meta<typeof DnsZoneRecordEditor> = {
  title: "Platforms/DeveloperPlatform/DnsZoneRecordEditor",
  component: DnsZoneRecordEditor,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DnsZoneRecordEditor>;

export const Default: Story = {
  args: {
    zoneName: "unierp.io",
    records: mockRecords,
  },
};

export const UltraCompactDensity: Story = {
  args: {
    zoneName: "unierp.io",
    records: mockRecords,
    density: "ultra-compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <h3>Authoritative DNS Zone Editor Anatomy</h3>
      <DnsZoneRecordEditor
        zoneName="unierp.io"
        records={mockRecords}
        density="compact"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div>
        <h4>Standard Density</h4>
        <DnsZoneRecordEditor
          zoneName="unierp.io"
          records={mockRecords}
          density="standard"
        />
      </div>
      <div>
        <h4>Comfortable Density</h4>
        <DnsZoneRecordEditor
          zoneName="unierp.io"
          records={mockRecords}
          density="comfortable"
        />
      </div>
    </div>
  ),
};
