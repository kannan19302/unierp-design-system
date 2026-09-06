import type { Meta, StoryObj } from "@storybook/react";
import {
  GradebookMatrixGrid,
  GradeAssignment,
  StudentGradeRecord,
} from "./gradebook-matrix-grid";

const mockAssignments: GradeAssignment[] = [
  { id: "asg-1", name: "Midterm Exam 1", category: "exam", maxPoints: 100, weightPercent: 30 },
  { id: "asg-2", name: "Orbital Lab 1 (MATLAB)", category: "lab", maxPoints: 50, weightPercent: 20 },
  { id: "asg-3", name: "Nozzle Design Problem Set", category: "homework", maxPoints: 25, weightPercent: 10 },
  { id: "asg-4", name: "Propulsion Final Project", category: "exam", maxPoints: 150, weightPercent: 40 },
];

const mockStudents: StudentGradeRecord[] = [
  {
    id: "std-1",
    name: "Aiden Scott",
    studentId: "STU-8821",
    avatarInitials: "AS",
    scores: {
      "asg-1": { assignmentId: "asg-1", pointsEarned: 94 },
      "asg-2": { assignmentId: "asg-2", pointsEarned: 48 },
      "asg-3": { assignmentId: "asg-3", pointsEarned: 25 },
      "asg-4": { assignmentId: "asg-4", pointsEarned: 142 },
    },
  },
  {
    id: "std-2",
    name: "Brianna Lin",
    studentId: "STU-8822",
    avatarInitials: "BL",
    scores: {
      "asg-1": { assignmentId: "asg-1", pointsEarned: 88 },
      "asg-2": { assignmentId: "asg-2", pointsEarned: 45 },
      "asg-3": { assignmentId: "asg-3", pointsEarned: 22, status: "late" },
      "asg-4": { assignmentId: "asg-4", pointsEarned: 135 },
    },
  },
  {
    id: "std-3",
    name: "Cameron Hayes",
    studentId: "STU-8823",
    avatarInitials: "CH",
    scores: {
      "asg-1": { assignmentId: "asg-1", pointsEarned: 76 },
      "asg-2": { assignmentId: "asg-2", pointsEarned: 38 },
      "asg-3": { assignmentId: "asg-3", pointsEarned: null, status: "missing" },
      "asg-4": { assignmentId: "asg-4", pointsEarned: 110 },
    },
  },
  {
    id: "std-4",
    name: "Daniella Rossi",
    studentId: "STU-8824",
    avatarInitials: "DR",
    scores: {
      "asg-1": { assignmentId: "asg-1", pointsEarned: null, status: "excused" },
      "asg-2": { assignmentId: "asg-2", pointsEarned: 50 },
      "asg-3": { assignmentId: "asg-3", pointsEarned: 25 },
      "asg-4": { assignmentId: "asg-4", pointsEarned: 148 },
    },
  },
];

const meta: Meta<typeof GradebookMatrixGrid> = {
  title: "Data Grid/GradebookMatrixGrid",
  component: GradebookMatrixGrid,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GradebookMatrixGrid>;

export const Default: Story = {
  args: {
    courseCode: "AERO-401",
    courseTitle: "Advanced Orbital Mechanics & Propulsion Systems",
    termLabel: "Fall 2026",
    assignments: mockAssignments,
    students: mockStudents,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
