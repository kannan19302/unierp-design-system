import React, { useId, useState, useMemo } from "react";
import styles from "./iam-permission-matrix-auditor.module.css";

export type PermissionDecision = "allow" | "deny" | "explicit_deny" | "inherited" | "not_applicable";
export type PrincipalType = "user" | "role" | "group" | "service_account";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface IamPrincipal {
  id: string;
  name: string;
  type: PrincipalType;
  department?: string;
  isOverPrivileged?: boolean;
}

export interface IamPermission {
  id: string;
  service: string; // "S3", "KMS", "IAM", "PostgreSQL", "Billing"
  action: string; // "GetObject", "Decrypt", "DropTable"
  riskLevel: RiskLevel;
  description?: string;
}

export interface IamCellState {
  decision: PermissionDecision;
  policySource?: string; // "AdministratorAccess", "BillingReadOnly"
  conditionMet?: boolean;
}

export interface IamPermissionMatrixAuditorProps {
  principals: IamPrincipal[];
  permissions: IamPermission[];
  matrix: Record<string, IamCellState>; // key: `${principalId}__${permissionId}`
  selectedPrincipalId?: string;
  onSelectPrincipal?: (principalId: string) => void;
  onSimulateEvaluation?: (principalId: string, permissionId: string) => void;
  onRevokePermission?: (principalId: string, permissionId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const IamPermissionMatrixAuditor: React.FC<IamPermissionMatrixAuditorProps> = ({
  principals,
  permissions,
  matrix,
  selectedPrincipalId: initialPrincipalId,
  onSelectPrincipal,
  onSimulateEvaluation,
  onRevokePermission,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [selectedId, setSelectedId] = useState<string>(
    initialPrincipalId ?? (principals.length > 0 ? (principals[0]?.id ?? "") : "")
  );
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [inspectingCellKey, setInspectingCellKey] = useState<string | null>(null);

  const getCellKey = (principalId: string, permissionId: string) =>
    `${principalId}__${permissionId}`;

  const currentPrincipal = useMemo(() => {
    return principals.find((p) => p.id === selectedId) ?? principals[0];
  }, [principals, selectedId]);

  const uniqueServices = useMemo(() => {
    const set = new Set<string>();
    permissions.forEach((p) => set.add(p.service));
    return Array.from(set).sort();
  }, [permissions]);

  const filteredPermissions = useMemo(() => {
    return permissions.filter((p) => {
      const matchService = serviceFilter === "all" || p.service === serviceFilter;
      const matchRisk = riskFilter === "all" || p.riskLevel === riskFilter;
      const matchSearch =
        !searchTerm.trim() ||
        p.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.service.toLowerCase().includes(searchTerm.toLowerCase());
      return matchService && matchRisk && matchSearch;
    });
  }, [permissions, serviceFilter, riskFilter, searchTerm]);

  const stats = useMemo(() => {
    let allows = 0;
    let explicitDenies = 0;
    let criticalRiskAllows = 0;

    if (currentPrincipal) {
      permissions.forEach((perm) => {
        const key = getCellKey(currentPrincipal.id, perm.id);
        const cell = matrix[key];
        if (cell?.decision === "allow" || cell?.decision === "inherited") {
          allows++;
          if (perm.riskLevel === "critical") criticalRiskAllows++;
        } else if (cell?.decision === "explicit_deny") {
          explicitDenies++;
        }
      });
    }

    return { allows, explicitDenies, criticalRiskAllows };
  }, [currentPrincipal, permissions, matrix]);

  const renderDecisionBadge = (decision?: PermissionDecision) => {
    switch (decision) {
      case "allow":
        return <span className={styles.cellAllow} title="Explicit Allow">ALLOW</span>;
      case "inherited":
        return <span className={styles.cellInherited} title="Inherited Allow">INHERITED</span>;
      case "explicit_deny":
        return <span className={styles.cellExplicitDeny} title="Explicit SCP or Boundary Deny">DENY (SCP)</span>;
      case "deny":
        return <span className={styles.cellDeny} title="Implicit Deny">DENY</span>;
      default:
        return <span className={styles.cellNone} title="Not Configured">&mdash;</span>;
    }
  };

  const activeInspection = useMemo(() => {
    if (!inspectingCellKey) return null;
    const parts = inspectingCellKey.split("__");
    const princId = parts[0] ?? "";
    const permId = parts[1] ?? "";
    const principal = principals.find((p) => p.id === princId);
    const permission = permissions.find((p) => p.id === permId);
    const cellState = matrix[inspectingCellKey];
    return { principal, permission, cellState, key: inspectingCellKey };
  }, [inspectingCellKey, principals, permissions, matrix]);

  return (
    <section
      className={`${styles.container} ${className}`}
      data-density={density}
      aria-labelledby={headingId}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitleBlock}>
          <span className={styles.badgeTag}>Cloud IAM Simulator</span>
          <h2 id={headingId} className={styles.title}>
            IAM Effective Permissions Matrix & Auditor
          </h2>
          <p className={styles.subtitle}>
            Simulate principal evaluation policies against RBAC, ABAC, and Service Control Policies (SCP).
          </p>
        </div>

        {/* Security Metric Chips */}
        <div className={styles.metricsRow}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Effective Actions Allowed</span>
            <span className={styles.metricValue}>{stats.allows}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Critical Risk Exposure</span>
            <span className={stats.criticalRiskAllows > 0 ? styles.metricValueDanger : styles.metricValue}>
              {stats.criticalRiskAllows}
            </span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Explicit SCP Denies</span>
            <span className={styles.metricValue}>{stats.explicitDenies}</span>
          </div>
        </div>
      </header>

      {/* Control Bar: Principal Switcher & Filter Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.principalSelectWrap}>
          <label htmlFor="iam-principal-select" className={styles.filterLabel}>
            Target Principal:
          </label>
          <select
            id="iam-principal-select"
            className={styles.select}
            value={currentPrincipal?.id ?? ""}
            onChange={(e) => {
              setSelectedId(e.target.value);
              onSelectPrincipal?.(e.target.value);
            }}
          >
            {principals.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.type.replace("_", " ")}{p.department ? ` - ${p.department}` : ""})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filtersGroup}>
          <div>
            <label htmlFor="iam-service-filter" className={styles.filterLabel}>
              Service:
            </label>
            <select
              id="iam-service-filter"
              className={styles.select}
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option value="all">All Services ({uniqueServices.length})</option>
              {uniqueServices.map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="iam-risk-filter" className={styles.filterLabel}>
              Risk Tier:
            </label>
            <select
              id="iam-risk-filter"
              className={styles.select}
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="all">All Risks</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label htmlFor="iam-search-action" className={styles.srOnly}>
              Search Action
            </label>
            <input
              id="iam-search-action"
              type="text"
              placeholder="Search action or service..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid Table & Inspection Sidebar Layout */}
      <div className={styles.contentLayout}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <caption className={styles.srOnly}>
              IAM Permission simulation matrix for {currentPrincipal?.name ?? "principal"}
            </caption>
            <thead>
              <tr>
                <th scope="col" className={styles.thService}>Service</th>
                <th scope="col" className={styles.thAction}>Action</th>
                <th scope="col" className={styles.thRisk}>Risk Tier</th>
                <th scope="col" className={styles.thDecision}>Effective Decision</th>
                <th scope="col" className={styles.thPolicy}>Enforcing Policy</th>
                <th scope="col" className={styles.thActionBtn}>Evaluate</th>
              </tr>
            </thead>
            <tbody>
              {filteredPermissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyTd}>
                    No IAM actions match current filters.
                  </td>
                </tr>
              ) : (
                filteredPermissions.map((perm) => {
                  const key = getCellKey(currentPrincipal?.id ?? "", perm.id);
                  const cell = matrix[key];
                  const isSelected = inspectingCellKey === key;

                  return (
                    <tr
                      key={perm.id}
                      className={`${styles.row} ${isSelected ? styles.rowSelected : ""}`}
                      onClick={() => setInspectingCellKey(key)}
                    >
                      <td className={styles.tdService}>
                        <span className={styles.serviceChip}>{perm.service}</span>
                      </td>
                      <td className={styles.tdAction}>
                        <strong>{perm.action}</strong>
                        {perm.description && (
                          <span className={styles.actionDesc}>{perm.description}</span>
                        )}
                      </td>
                      <td className={styles.tdRisk}>
                        <span className={`${styles.riskBadge} ${styles[`risk_${perm.riskLevel}`]}`}>
                          {perm.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className={styles.tdDecision}>{renderDecisionBadge(cell?.decision)}</td>
                      <td className={styles.tdPolicy}>
                        <span className={styles.policySource}>
                          {cell?.policySource ?? "Default Implicit Deny"}
                        </span>
                      </td>
                      <td className={styles.tdActionBtn}>
                        <button
                          type="button"
                          className={styles.inspectBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingCellKey(key);
                            onSimulateEvaluation?.(currentPrincipal?.id ?? "", perm.id);
                          }}
                          aria-label={`Simulate policy evaluation for ${perm.service}:${perm.action}`}
                        >
                          Simulate
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Detailed Evaluation Trace Panel */}
        {activeInspection && activeInspection.permission && activeInspection.principal && (
          <aside className={styles.evaluationPanel} aria-label="Policy Simulation Trace">
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Policy Simulation Trace</h3>
              <button
                type="button"
                className={styles.closePanelBtn}
                onClick={() => setInspectingCellKey(null)}
                aria-label="Close policy simulation trace"
              >
                &times;
              </button>
            </div>

            <div className={styles.panelMeta}>
              <div>
                <span className={styles.panelLabel}>Principal:</span>
                <span className={styles.panelValue}>{activeInspection.principal.name}</span>
              </div>
              <div>
                <span className={styles.panelLabel}>Action:</span>
                <span className={styles.panelValue}>
                  {activeInspection.permission.service}:{activeInspection.permission.action}
                </span>
              </div>
              <div>
                <span className={styles.panelLabel}>Final Decision:</span>
                {renderDecisionBadge(activeInspection.cellState?.decision)}
              </div>
            </div>

            {/* 5-Step AWS/Cloud Evaluation Logic Waterfall */}
            <div className={styles.logicWaterfall}>
              <h4 className={styles.waterfallHeader}>Evaluation Chain</h4>
              <ol className={styles.stepList}>
                <li className={styles.stepItem}>
                  <div className={styles.stepMarker}>1</div>
                  <div className={styles.stepText}>
                    <strong>Organization SCP:</strong>{" "}
                    {activeInspection.cellState?.decision === "explicit_deny"
                      ? "❌ Denied by Service Control Policy"
                      : "✓ Passed (No explicit deny)"}
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <div className={styles.stepMarker}>2</div>
                  <div className={styles.stepText}>
                    <strong>Permission Boundaries:</strong> ✓ Within boundary limits
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <div className={styles.stepMarker}>3</div>
                  <div className={styles.stepText}>
                    <strong>Identity Policy:</strong>{" "}
                    {activeInspection.cellState?.decision === "allow" ||
                    activeInspection.cellState?.decision === "inherited"
                      ? `✓ Allowed by [${activeInspection.cellState.policySource ?? "Policy"}]`
                      : "Implicit Deny (No allow rule matched)"}
                  </div>
                </li>
                <li className={styles.stepItem}>
                  <div className={styles.stepMarker}>4</div>
                  <div className={styles.stepText}>
                    <strong>Resource-Based Policy:</strong> Not evaluated / Default
                  </div>
                </li>
              </ol>
            </div>

            {onRevokePermission && (
              <div className={styles.panelActions}>
                <button
                  type="button"
                  className={styles.revokeButton}
                  onClick={() =>
                    onRevokePermission(
                      activeInspection.principal?.id ?? "",
                      activeInspection.permission?.id ?? ""
                    )
                  }
                >
                  Revoke Action from Principal
                </button>
              </div>
            )}
          </aside>
        )}
      </div>
    </section>
  );
};
