import type { Meta, StoryObj } from "@storybook/react";
import {
  ShiftRosterScheduler,
  EmployeeRosterEntry,
} from "./shift-roster-scheduler";

const mockEmployees: EmployeeRosterEntry[] = [
  {
    employeeId: "emp-101",
    fullName: "Marco Rossi",
    roleTitle: "Executive Chef",
    hourlyRate: 36.0,
    shifts: [
      { id: "s1", dayIndex: 0, startTime: "08:00", endTime: "16:30", hours: 8.5, role: "Executive Chef" },
      { id: "s2", dayIndex: 1, startTime: "08:00", endTime: "16:30", hours: 8.5, role: "Executive Chef" },
      { id: "s3", dayIndex: 2, startTime: "08:00", endTime: "16:30", hours: 8.5, role: "Executive Chef" },
      { id: "s4", dayIndex: 3, startTime: "08:00", endTime: "16:30", hours: 8.5, role: "Executive Chef" },
      { id: "s5", dayIndex: 4, startTime: "10:00", endTime: "18:30", hours: 8.5, role: "Executive Chef" },
    ],
  },
  {
    employeeId: "emp-102",
    fullName: "Chloe Dubois",
    roleTitle: "Head Sommelier & Host",
    hourlyRate: 28.5,
    shifts: [
      { id: "s6", dayIndex: 2, startTime: "16:00", endTime: "00:00", hours: 8.0, role: "Sommelier" },
      { id: "s7", dayIndex: 3, startTime: "16:00", endTime: "00:00", hours: 8.0, role: "Sommelier" },
      { id: "s8", dayIndex: 4, startTime: "16:00", endTime: "00:30", hours: 8.5, role: "Sommelier" },
      { id: "s9", dayIndex: 5, startTime: "16:00", endTime: "01:00", hours: 9.0, role: "Sommelier" },
    ],
  },
  {
    employeeId: "emp-103",
    fullName: "Mateo Alvarez",
    roleTitle: "Lead Bartender",
    hourlyRate: 24.0,
    shifts: [
      { id: "s10", dayIndex: 3, startTime: "17:00", endTime: "01:00", hours: 8.0, role: "Bartender" },
      { id: "s11", dayIndex: 4, startTime: "17:00", endTime: "02:00", hours: 9.0, role: "Bartender" },
      { id: "s12", dayIndex: 5, startTime: "17:00", endTime: "02:00", hours: 9.0, role: "Bartender" },
      { id: "s13", dayIndex: 6, startTime: "16:00", endTime: "23:00", hours: 7.0, role: "Bartender" },
    ],
  },
];

const meta: Meta<typeof ShiftRosterScheduler> = {
  title: "Data Grid/ShiftRosterScheduler",
  component: ShiftRosterScheduler,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ShiftRosterScheduler>;

export const Default: Story = {
  args: {
    employees: mockEmployees,
    rosterWeekLabel: "Sep 07 - Sep 13, 2026",
    departmentName: "Meridian Bistro & Kitchen",
    laborBudget: 5000,
  },
};

export const UltraCompactDensity: Story = {
  args: {
    employees: mockEmployees,
    density: "ultra-compact",
  },
};
