import type { Meta, StoryObj } from "@storybook/react";
import {
  InboundReceivingDiscrepancyLog,
  InboundReceivingLine,
} from "./inbound-receiving-discrepancy-log";

const sampleLines: InboundReceivingLine[] = [
  {
    id: "rcv_line_01",
    sku: "AV-TURB-772",
    description: "Titanium Compressor Rotor Blade 70mm",
    expectedUnits: 500,
    receivedUnits: 480,
    damagedUnits: 5,
    discrepancyUnits: -20,
    lotNumber: "LOT-2026-B81",
    disposition: "QUARANTINED",
  },
  {
    id: "rcv_line_02",
    sku: "AV-SEAL-104",
    description: "High-Pressure Hydraulic O-Ring Nitrile",
    expectedUnits: 2000,
    receivedUnits: 2000,
    damagedUnits: 0,
    discrepancyUnits: 0,
    lotNumber: "LOT-2026-A12",
    disposition: "ACCEPTED",
  },
  {
    id: "rcv_line_03",
    sku: "AV-SENS-419",
    description: "Exhaust Gas Temp Thermocouple Probe",
    expectedUnits: 150,
    receivedUnits: 160,
    damagedUnits: 2,
    discrepancyUnits: 10,
    lotNumber: "LOT-2026-C09",
    disposition: "PENDING_INSPECTION",
  },
  {
    id: "rcv_line_04",
    sku: "AV-FAST-881",
    description: "Inconel 718 Hex Cap Screws 3/8-24",
    expectedUnits: 5000,
    receivedUnits: 4600,
    damagedUnits: 400,
    discrepancyUnits: -400,
    lotNumber: "LOT-2026-X99",
    disposition: "RETURNED_TO_VENDOR",
  },
];

const meta: Meta<typeof InboundReceivingDiscrepancyLog> = {
  title: "Platforms/BusinessSuite/InboundReceivingDiscrepancyLog",
  component: InboundReceivingDiscrepancyLog,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InboundReceivingDiscrepancyLog>;

export const Default: Story = {
  args: {
    poNumber: "PO-2026-9914",
    supplierName: "Honeywell Aerospace Avionics",
    dockDoor: "Dock 04B",
    lines: sampleLines,
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    ...Default.args,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Default Compact View</h4>
        <InboundReceivingDiscrepancyLog
          poNumber="PO-2026-9914"
          supplierName="Honeywell Aerospace Avionics"
          dockDoor="Dock 04B"
          lines={sampleLines}
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Ultra-Compact View</h4>
        <InboundReceivingDiscrepancyLog
          poNumber="PO-2026-9914"
          supplierName="Honeywell Aerospace Avionics"
          dockDoor="Dock 04B"
          lines={sampleLines}
          density="ultra-compact"
        />
      </div>
    </div>
  ),
};

export const UltraCompact: Story = {
  args: {
    poNumber: "PO-2026-9914",
    supplierName: "Honeywell Aerospace Avionics",
    dockDoor: "Dock 04B",
    lines: sampleLines,
    density: "ultra-compact",
  },
};
