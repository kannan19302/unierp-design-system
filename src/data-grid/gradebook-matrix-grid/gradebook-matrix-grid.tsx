import React, { useId, useState, useMemo } from "react";
import styles from "./gradebook-matrix-grid.module.css";

export interface GradeAssignment {
  id: string;
  name: string;
  category: "exam" | "lab" | "homework" | "quiz";
  maxPoints: number;
  weightPercent: number; // e.g. 40
}

export interface StudentScore {
  assignmentId: string;
  pointsEarned: number | null; // null if missing or excused
  status?: "submitted" | "late" | "missing" | "excused";
}

export interface StudentGradeRecord {
  id: string;
  name: string;
  studentId: string;
  avatarInitials: string;
  scores: Record<string, StudentScore>;
}

export interface GradebookMatrixGridProps {
  courseCode?: string;
  courseTitle?: string;
  termLabel?: string;
  assignments: GradeAssignment[];
  students: StudentGradeRecord[];
  onScoreUpdate?: (studentId: string, assignmentId: string, newPoints: number) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const GradebookMatrixGrid: React.FC<GradebookMatrixGridProps> = ({
  courseCode = "AERO-401",
  courseTitle = "Advanced Orbital Mechanics & Propulsion Systems",
  termLabel = "Fall 2026",
  assignments,
  students,
  onScoreUpdate: _onScoreUpdate,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Calculate cumulative grade for a student
  const calculateFinalGrade = (record: StudentGradeRecord) => {
    let earnedWeightTotal = 0;
    let possibleWeightTotal = 0;

    assignments.forEach((asg) => {
      const score = record.scores[asg.id];
      if (score && score.pointsEarned !== null && score.status !== "excused") {
        const pct = score.pointsEarned / asg.maxPoints;
        earnedWeightTotal += pct * asg.weightPercent;
        possibleWeightTotal += asg.weightPercent;
      }
    });

    const finalPct = possibleWeightTotal > 0 ? (earnedWeightTotal / possibleWeightTotal) * 100 : 0;

    let letter = "F";
    if (finalPct >= 93) letter = "A";
    else if (finalPct >= 90) letter = "A-";
    else if (finalPct >= 87) letter = "B+";
    else if (finalPct >= 83) letter = "B";
    else if (finalPct >= 80) letter = "B-";
    else if (finalPct >= 75) letter = "C+";
    else if (finalPct >= 70) letter = "C";
    else if (finalPct >= 60) letter = "D";

    return { finalPct, letter };
  };

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    const q = searchTerm.toLowerCase();
    return students.filter(
      (s) => s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q)
    );
  }, [students, searchTerm]);

  // Assignment class statistics
  const stats = useMemo(() => {
    return assignments.map((asg) => {
      let totalEarned = 0;
      let count = 0;
      students.forEach((s) => {
        const sc = s.scores[asg.id];
        if (sc && sc.pointsEarned !== null && sc.status !== "excused") {
          totalEarned += sc.pointsEarned;
          count++;
        }
      });
      const avg = count > 0 ? totalEarned / count : 0;
      const avgPct = asg.maxPoints > 0 ? (avg / asg.maxPoints) * 100 : 0;
      return { asgId: asg.id, avg, avgPct, count };
    });
  }, [assignments, students]);

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            🎓
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.courseBadge}>{courseCode}</span>
              <span className={styles.termBadge}>{termLabel}</span>
              <span className={styles.rosterCount}>{students.length} Enrolled Students</span>
            </div>
            <h2 id={headingId} className={styles.title}>
              {courseTitle}
            </h2>
          </div>
        </div>

        {/* Search Input */}
        <div className={styles.searchWrap}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search students by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Filter students roster"
          />
        </div>
      </header>

      {/* Gradebook Matrix Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Student gradebook matrix grid">
          <thead>
            <tr>
              <th scope="col" className={styles.studentTh}>Student (Roster)</th>
              <th scope="col" className={styles.gradeTh}>Overall Grade</th>
              {assignments.map((asg) => (
                <th key={asg.id} scope="col" className={styles.asgTh}>
                  <div className={styles.asgHeaderBox}>
                    <span className={styles.asgName}>{asg.name}</span>
                    <span className={styles.asgMeta}>
                      {asg.maxPoints} pts ({asg.weightPercent}%)
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const { finalPct, letter } = calculateFinalGrade(student);
              return (
                <tr key={student.id} className={styles.studentRow}>
                  <td className={styles.studentCell}>
                    <div className={styles.studentInfo}>
                      <span className={styles.avatar}>{student.avatarInitials}</span>
                      <div>
                        <span className={styles.name}>{student.name}</span>
                        <span className={styles.idTag}>ID: {student.studentId}</span>
                      </div>
                    </div>
                  </td>
                  <td className={styles.gradeCell}>
                    <span className={styles.letterPill}>{letter}</span>
                    <span className={styles.pctText}>{finalPct.toFixed(1)}%</span>
                  </td>
                  {assignments.map((asg) => {
                    const score = student.scores[asg.id];
                    return (
                      <td key={asg.id} className={styles.scoreCell}>
                        {score ? (
                          score.status === "excused" ? (
                            <span className={styles.badgeExcused}>EXCUSED</span>
                          ) : score.status === "missing" ? (
                            <span className={styles.badgeMissing}>MISSING</span>
                          ) : (
                            <div className={styles.scoreBox}>
                              <span className={styles.ptsEarned}>
                                {score.pointsEarned !== null ? score.pointsEarned : "—"}
                              </span>
                              {score.status === "late" && (
                                <span className={styles.badgeLate}>LATE</span>
                              )}
                            </div>
                          )
                        ) : (
                          <span className={styles.textMuted}>—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={styles.statsRow}>
              <th scope="row" colSpan={2} className={styles.statsLabel}>
                Class Average (Mean Score)
              </th>
              {stats.map((st) => (
                <td key={st.asgId} className={styles.asgStatCell}>
                  <span className={styles.statAvgPts}>
                    {st.avg.toFixed(1)} pts
                  </span>
                  <span className={styles.statAvgPct}>
                    ({st.avgPct.toFixed(0)}%)
                  </span>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};
