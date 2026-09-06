import React, { useId, useState, useMemo } from "react";
import styles from "./nine-box-talent-calibration-matrix.module.css";

export type PerformanceTier = 1 | 2 | 3; // 1: Low, 2: Medium, 3: High
export type PotentialTier = 1 | 2 | 3; // 1: Low, 2: Medium, 3: High

export interface CalibratedEmployee {
  id: string;
  name: string; // "Elena Rostova"
  role: string; // "Staff Platform Engineer"
  department: string; // "Cloud Infrastructure"
  performance: PerformanceTier;
  potential: PotentialTier;
  tenureYears: number; // 3.5
  retentionRisk?: "low" | "medium" | "high";
  readinessForPromotion?: "ready_now" | "1_year" | "lateral_move";
}

export interface NineBoxCellConfig {
  perf: PerformanceTier;
  pot: PotentialTier;
  label: string; // "Star / Future Executive"
  description: string;
  colorClass: string;
}

export interface NineBoxTalentCalibrationMatrixProps {
  cycleName?: string; // "2026 Executive & Senior Engineering Calibration"
  departmentFilterDefault?: string;
  employees: CalibratedEmployee[];
  onSelectEmployee?: (emp: CalibratedEmployee) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export type TalentCalibrationEmployee = CalibratedEmployee;
export type PerformanceRating = PerformanceTier;
export type PotentialRating = PotentialTier;
export type NineBoxGridCell = NineBoxCellConfig;

const NINE_BOX_CELLS: NineBoxCellConfig[] = [
  // Top Row (Potential = 3 High)
  { perf: 1, pot: 3, label: "Rough Diamond", description: "High potential, inconsistent performance", colorClass: styles.cellDiamond ?? "" },
  { perf: 2, pot: 3, label: "High Potential", description: "Strong performance, exceptional leadership upside", colorClass: styles.cellHighPot ?? "" },
  { perf: 3, pot: 3, label: "Star / Future Exec", description: "Consistently exceeds, elite future leader", colorClass: styles.cellStar ?? "" },

  // Middle Row (Potential = 2 Medium)
  { perf: 1, pot: 2, label: "Inconsistent", description: "Average potential, needs coaching on delivery", colorClass: styles.cellInconsistent ?? "" },
  { perf: 2, pot: 2, label: "Core Player", description: "Reliable performer, steady contributor in role", colorClass: styles.cellCore ?? "" },
  { perf: 3, pot: 2, label: "High Professional", description: "Deep subject matter expert, specialized driver", colorClass: styles.cellHighPro ?? "" },

  // Bottom Row (Potential = 1 Low)
  { perf: 1, pot: 1, label: "Risk / Underperformer", description: "Low performance & low growth, requires PIP", colorClass: styles.cellRisk ?? "" },
  { perf: 2, pot: 1, label: "Effective Specialist", description: "Meets expectations in current scope, limited runway", colorClass: styles.cellSpecialist ?? "" },
  { perf: 3, pot: 1, label: "Trusted Veteran", description: "High performer at current ceiling, anchor player", colorClass: styles.cellVeteran ?? "" },
];


export const NineBoxTalentCalibrationMatrix: React.FC<NineBoxTalentCalibrationMatrixProps> = ({
  cycleName = "2026 Global Leadership & Engineering Calibration",
  departmentFilterDefault = "all",
  employees,
  onSelectEmployee,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [deptFilter, setDeptFilter] = useState(departmentFilterDefault);
  const [selectedEmpId, setSelectedEmpId] = useState<string>(
    employees[0]?.id ?? ""
  );

  const departments = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.department)));
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    if (deptFilter === "all") return employees;
    return employees.filter((e) => e.department === deptFilter);
  }, [employees, deptFilter]);

  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmpId) ?? employees[0] ?? null;
  }, [employees, selectedEmpId]);

  const getEmployeesForCell = (perf: PerformanceTier, pot: PotentialTier) => {
    return filteredEmployees.filter((e) => e.performance === perf && e.potential === pot);
  };

  const handleEmployeeClick = (emp: CalibratedEmployee) => {
    setSelectedEmpId(emp.id);
    onSelectEmployee?.(emp);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.metaGroup}>
          <div className={styles.badgeRow}>
            <span className={styles.hcmBadge}>HCM TALENT MANAGEMENT</span>
            <span className={styles.countBadge}>{filteredEmployees.length} Leaders Calibrated</span>
          </div>
          <h2 id={headingId} className={styles.title}>
            {cycleName}
          </h2>
        </div>

        <div className={styles.filterControls}>
          <label htmlFor="nine-box-dept" className={styles.filterLabel}>
            Department:
          </label>
          <select
            id="nine-box-dept"
            className={styles.filterSelect}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="all">All Departments ({departments.length})</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className={styles.workspaceLayout}>
        <div className={styles.gridContainer}>
          <div className={styles.axisYLabel}>
            <span>▲ POTENTIAL (GROWTH RUNWAY)</span>
          </div>

          <div className={styles.matrixArea}>
            <div className={styles.nineBoxGrid} role="region" aria-label="9-Box Talent Matrix Grid">
              {NINE_BOX_CELLS.map((cell) => {
                const emps = getEmployeesForCell(cell.perf, cell.pot);

                return (
                  <div
                    key={`${cell.perf}-${cell.pot}`}
                    className={`${styles.cell} ${cell.colorClass}`}
                  >
                    <div className={styles.cellHeader}>
                      <span className={styles.cellLabel}>{cell.label}</span>
                      <span className={styles.cellCountPill}>{emps.length}</span>
                    </div>

                    <div className={styles.chipsContainer}>
                      {emps.map((emp) => {
                        const isSelected = selectedEmployee?.id === emp.id;
                        return (
                          <button
                            key={emp.id}
                            type="button"
                            className={`${styles.empChip} ${isSelected ? styles.chipSelected : ""}`}
                            onClick={() => handleEmployeeClick(emp)}
                            aria-label={`Select ${emp.name}, ${emp.role} in ${cell.label}`}
                          >
                            <span className={styles.avatarInitials}>
                              {emp.name.split(" ").map((n) => n[0]).join("")}
                            </span>
                            <span className={styles.empChipName}>{emp.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.axisXLabel}>
              <span>PERFORMANCE (DELIVERY & RESULTS) ►</span>
            </div>
          </div>
        </div>

        {/* Selected Employee Detail Drawer */}
        {selectedEmployee && (
          <aside className={styles.inspectorDrawer} aria-label="Calibrated Employee Profile">
            <div className={styles.drawerHeader}>
              <span className={styles.drawerDept}>{selectedEmployee.department}</span>
              <h3 className={styles.drawerName}>{selectedEmployee.name}</h3>
              <p className={styles.drawerRole}>{selectedEmployee.role}</p>
            </div>

            <div className={styles.kpiCardsCol}>
              <div className={styles.kpiMiniCard}>
                <span className={styles.kpiMiniLabel}>Performance Rating</span>
                <strong className={styles.kpiMiniVal}>
                  {selectedEmployee.performance === 3 ? "3 - Exceeds" : selectedEmployee.performance === 2 ? "2 - Meets" : "1 - Needs Improvement"}
                </strong>
              </div>
              <div className={styles.kpiMiniCard}>
                <span className={styles.kpiMiniLabel}>Potential Rating</span>
                <strong className={styles.kpiMiniVal}>
                  {selectedEmployee.potential === 3 ? "3 - High Upside" : selectedEmployee.potential === 2 ? "2 - Medium" : "1 - Specialized"}
                </strong>
              </div>
              <div className={styles.kpiMiniCard}>
                <span className={styles.kpiMiniLabel}>Succession Readiness</span>
                <strong className={styles.kpiMiniVal}>
                  {selectedEmployee.readinessForPromotion === "ready_now" ? "Ready Now (P1)" : "1 Year Horizon"}
                </strong>
              </div>
            </div>

            <div className={styles.notesSection}>
              <span className={styles.kpiMiniLabel}>Tenure in Role</span>
              <p className={styles.tenureText}>{selectedEmployee.tenureYears} Years in Current Band</p>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
};
