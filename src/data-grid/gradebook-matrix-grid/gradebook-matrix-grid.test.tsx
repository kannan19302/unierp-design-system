import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  GradebookMatrixGrid,
  GradeAssignment,
  StudentGradeRecord,
} from "./gradebook-matrix-grid";

const sampleAssignments: GradeAssignment[] = [
  { id: "asg-1", name: "Midterm Exam", category: "exam", maxPoints: 100, weightPercent: 50 },
  { id: "asg-2", name: "Final Exam", category: "exam", maxPoints: 100, weightPercent: 50 },
];

const sampleStudents: StudentGradeRecord[] = [
  {
    id: "std-1",
    name: "Aiden Scott",
    studentId: "STU-8821",
    avatarInitials: "AS",
    scores: {
      "asg-1": { assignmentId: "asg-1", pointsEarned: 94 },
      "asg-2": { assignmentId: "asg-2", pointsEarned: 96 },
    },
  },
  {
    id: "std-2",
    name: "Brianna Lin",
    studentId: "STU-8822",
    avatarInitials: "BL",
    scores: {
      "asg-1": { assignmentId: "asg-1", pointsEarned: 80 },
      "asg-2": { assignmentId: "asg-2", pointsEarned: 84 },
    },
  },
];

describe("GradebookMatrixGrid", () => {
  it("renders course header, student rows, and assignment columns", () => {
    render(
      <GradebookMatrixGrid
        courseCode="AERO-401"
        courseTitle="Orbital Mechanics"
        assignments={sampleAssignments}
        students={sampleStudents}
      />
    );

    expect(screen.getByText("Orbital Mechanics")).toBeInTheDocument();
    expect(screen.getByText("AERO-401")).toBeInTheDocument();
    expect(screen.getByText("Aiden Scott")).toBeInTheDocument();
    expect(screen.getByText("Brianna Lin")).toBeInTheDocument();
    expect(screen.getByText("Midterm Exam")).toBeInTheDocument();
  });

  it("filters student rows by name query", () => {
    render(
      <GradebookMatrixGrid
        assignments={sampleAssignments}
        students={sampleStudents}
      />
    );

    expect(screen.getByText("Aiden Scott")).toBeInTheDocument();
    expect(screen.getByText("Brianna Lin")).toBeInTheDocument();

    const searchInput = screen.getByLabelText(/Filter students roster/i);
    fireEvent.change(searchInput, { target: { value: "Brianna" } });

    expect(screen.queryByText("Aiden Scott")).not.toBeInTheDocument();
    expect(screen.getByText("Brianna Lin")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <GradebookMatrixGrid
        assignments={sampleAssignments}
        students={sampleStudents}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
