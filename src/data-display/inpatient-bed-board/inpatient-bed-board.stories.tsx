import type { Meta, StoryObj } from "@storybook/react";
import { InpatientBedBoard, type InpatientBed } from "./inpatient-bed-board";

const mockBeds: InpatientBed[] = [
  {
    id: "bed-1",
    roomNumber: "Room 401-A",
    wardName: "Cardiology Step-Down",
    occupancyState: "occupied",
    patientInitials: "E.V.",
    patientAge: 68,
    acuityLevel: 3,
    attendingPhysician: "Dr. Rachel Thorne",
    isolation: "none",
    hoursUntilDischarge: 3,
  },
  {
    id: "bed-2",
    roomNumber: "Room 401-B",
    wardName: "Cardiology Step-Down",
    occupancyState: "occupied",
    patientInitials: "J.K.",
    patientAge: 74,
    acuityLevel: 4,
    attendingPhysician: "Dr. Rachel Thorne",
    isolation: "contact",
  },
  {
    id: "bed-3",
    roomNumber: "Room 402-A",
    wardName: "Cardiology Step-Down",
    occupancyState: "discharged_dirty",
    isolation: "none",
  },
  {
    id: "bed-4",
    roomNumber: "Room 402-B",
    wardName: "Cardiology Step-Down",
    occupancyState: "clean_ready",
    isolation: "none",
    lastCleanedTimestamp: "10 mins ago",
  },
  {
    id: "bed-5",
    roomNumber: "Room 403-ISO",
    wardName: "Negative Pressure Isolation",
    occupancyState: "occupied",
    patientInitials: "M.R.",
    patientAge: 42,
    acuityLevel: 5,
    attendingPhysician: "Dr. Alan Mercer",
    isolation: "airborne",
  },
];

const meta: Meta<typeof InpatientBedBoard> = {
  title: "DataDisplay/InpatientBedBoard",
  component: InpatientBedBoard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InpatientBedBoard>;

export const Default: Story = {
  args: {
    wardTitle: "4-North Inpatient Surgical & Step-Down Ward",
    facilityName: "Memorial Academic Health Center",
    beds: mockBeds,
  },
};

export const HighCensus: Story = {
  args: {
    wardTitle: "Emergency Surge Inpatient Unit",
    facilityName: "Metropolitan Trauma Center",
    beds: mockBeds.map((b) => ({ ...b, occupancyState: "occupied" })),
  },
};
