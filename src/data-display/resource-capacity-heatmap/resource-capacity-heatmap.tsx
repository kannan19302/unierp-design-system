import React, { useState, useId, useMemo } from "react";
import styles from "./resource-capacity-heatmap.module.css";

export interface CapacityPeriod {
  key: string;
  label: string;
}

export interface TaskAssignment {
  id: string;
  title: string;
  project: string;
  hours: number;
}

export interface CapacityCellData {
  periodKey: string;
  allocatedHours: number;
  capacityHours: number;
  tasks?: TaskAssignment[];
}

export interface ResourceRow {
  id: string;
  name: string;
  role: string;
  department?: string;
  avatarUrl?: string;
  cells: CapacityCellData[];
}

export interface ResourceCapacityHeatmapProps {
  /** Title of the capacity heatmap */
  title?: string;
  /** Monitored sprint or calendar periods */
  periods: CapacityPeriod[];
  /** Team member resource rows */
  resources: ResourceRow[];
  /** Callback fired when a cell is clicked */
  onSelectCell?: (resource: ResourceRow, cell: CapacityCellData) => void;
  /** Density level */
  density?: "compact" | "comfortable";
  /** Optional custom CSS class */
  className?: string;
}

export const ResourceCapacityHeatmap: React.FC<ResourceCapacityHeatmapProps> = ({
  title = "Team Capacity & Workload Allocation",
  periods,
  resources,
  onSelectCell,
  density = "compact",
  className,
}) => {
  const heatmapId = useId();
  const [selectedCellKey, setSelectedCellKey] = useState<string | null>(null);

  // Compute period totals
  const periodSummaries = useMemo(() => {
    return periods.map((period) => {
      let totalAlloc = 0;
      let totalCap = 0;
      resources.forEach((r) => {
        const cell = r.cells.find((c) => c.periodKey === period.key);
        if (cell) {
          totalAlloc += cell.allocatedHours;
          totalCap += cell.capacityHours;
        }
      });
      const pct = totalCap > 0 ? Math.round((totalAlloc / totalCap) * 100) : 0;
      return {
        key: period.key,
        totalAllocated: totalAlloc,
        totalCapacity: totalCap,
        utilizationPct: pct,
      };
    });
  }, [periods, resources]);

  const getHeatmapClass = (allocated: number, capacity: number) => {
    if (capacity === 0) return styles.heatEmpty;
    const ratio = allocated / capacity;
    if (ratio > 1.0) return styles.heatOverloaded;
    if (ratio >= 0.85) return styles.heatHigh;
    if (ratio >= 0.6) return styles.heatOptimal;
    return styles.heatLow;
  };

  const handleCellClick = (resource: ResourceRow, cell: CapacityCellData) => {
    const key = `${resource.id}-${cell.periodKey}`;
    setSelectedCellKey(key);
    onSelectCell?.(resource, cell);
  };

  // Find currently active drill-down cell
  const activeDrilldown = useMemo(() => {
    if (!selectedCellKey) return null;
    const [resId, pKey] = selectedCellKey.split("-");
    const resource = resources.find((r) => r.id === resId);
    if (!resource) return null;
    const cell = resource.cells.find((c) => c.periodKey === pKey);
    const period = periods.find((p) => p.key === pKey);
    if (!cell || !period) return null;
    return { resource, cell, period };
  }, [selectedCellKey, resources, periods]);

  return (
    <div
      className={`${styles.container} ${className ?? ""}`}
      data-density={density}
      aria-labelledby={`${heatmapId}-title`}
    >
      {/* Header Bar */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.heatBadge}>CAPACITY</span>
          <h3 id={`${heatmapId}-title`} className={styles.title}>
            {title}
          </h3>
          <span className={styles.resourceCountPill}>
            {resources.length} Team Members ({periods.length} Sprints)
          </span>
        </div>

        {/* Legend */}
        <div className={styles.legendGroup} aria-label="Capacity utilization color legend">
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotLow}`} /> &lt;60%
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotOptimal}`} /> 60–85% Optimal
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotHigh}`} /> 85–100% Near Cap
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.dotOverloaded}`} /> &gt;100% Overload
          </span>
        </div>
      </div>

      {/* Main Heatmap Matrix Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Resource capacity heatmap matrix">
          <thead>
            <tr>
              <th scope="col" className={styles.thMember}>Team Member</th>
              <th scope="col" className={styles.thRole}>Role / Dept</th>
              {periods.map((period) => (
                <th key={period.key} scope="col" className={styles.thPeriod}>
                  {period.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className={styles.tr}>
                <td className={`${styles.td} ${styles.tdMember}`}>
                  <div className={styles.memberCell}>
                    <div className={styles.avatar}>
                      {resource.avatarUrl ? (
                        <img src={resource.avatarUrl} alt="" className={styles.avatarImg} />
                      ) : (
                        resource.name.charAt(0)
                      )}
                    </div>
                    <span className={styles.memberName}>{resource.name}</span>
                  </div>
                </td>
                <td className={`${styles.td} ${styles.tdRole}`}>
                  <span className={styles.roleText}>{resource.role}</span>
                </td>
                {periods.map((period) => {
                  const cell = resource.cells.find((c) => c.periodKey === period.key);
                  if (!cell) {
                    return (
                      <td key={period.key} className={`${styles.td} ${styles.tdHeatEmpty}`}>
                        —
                      </td>
                    );
                  }

                  const isSelected = selectedCellKey === `${resource.id}-${cell.periodKey}`;
                  const heatClass = getHeatmapClass(cell.allocatedHours, cell.capacityHours);
                  const pct =
                    cell.capacityHours > 0
                      ? Math.round((cell.allocatedHours / cell.capacityHours) * 100)
                      : 0;

                  return (
                    <td key={period.key} className={styles.tdHeat}>
                      <button
                        type="button"
                        className={`${styles.heatCellBtn} ${heatClass} ${
                          isSelected ? styles.heatCellSelected : ""
                        }`}
                        onClick={() => handleCellClick(resource, cell)}
                        aria-label={`${resource.name} on ${period.label}: ${cell.allocatedHours} of ${cell.capacityHours} hours (${pct}% capacity)`}
                        aria-pressed={isSelected}
                      >
                        <span className={styles.cellHours}>
                          {cell.allocatedHours}h / {cell.capacityHours}h
                        </span>
                        <span className={styles.cellPct}>{pct}%</span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={styles.tfootRow}>
              <td className={styles.td} colSpan={2}>
                <strong>Squad Total Workload</strong>
              </td>
              {periodSummaries.map((summary) => (
                <td key={summary.key} className={`${styles.td} ${styles.tdSummary}`}>
                  <span className={styles.summaryHours}>
                    {summary.totalAllocated}h / {summary.totalCapacity}h
                  </span>
                  <span
                    className={`${styles.summaryPct} ${
                      summary.utilizationPct > 100
                        ? styles.textDanger
                        : summary.utilizationPct >= 85
                        ? styles.textWarning
                        : styles.textSuccess
                    }`}
                  >
                    {summary.utilizationPct}% Avg
                  </span>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Selected Cell Drill-Down Drawer */}
      {activeDrilldown && (
        <div className={styles.drilldownCard} role="region" aria-label="Selected workload drilldown">
          <div className={styles.drilldownHeader}>
            <div className={styles.drilldownTitle}>
              <strong>{activeDrilldown.resource.name}</strong> • {activeDrilldown.period.label}
            </div>
            <div className={styles.drilldownStats}>
              <span>Allocated: {activeDrilldown.cell.allocatedHours} hrs</span>
              <span>Capacity: {activeDrilldown.cell.capacityHours} hrs</span>
            </div>
          </div>
          {activeDrilldown.cell.tasks && activeDrilldown.cell.tasks.length > 0 ? (
            <ul className={styles.taskList} aria-label="Assigned tasks list">
              {activeDrilldown.cell.tasks.map((task) => (
                <li key={task.id} className={styles.taskItem}>
                  <span className={styles.taskTitle}>{task.title}</span>
                  <span className={styles.taskProject}>({task.project})</span>
                  <span className={styles.taskHours}>{task.hours}h</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noTasks}>No specific sub-tasks tagged for this period.</p>
          )}
        </div>
      )}
    </div>
  );
};
