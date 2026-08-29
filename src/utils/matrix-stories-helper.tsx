import { type ReactNode, type FC } from "react";

export interface SixStatesMatrixProps {
  title?: string;
  defaultState: ReactNode;
  loadingState: ReactNode;
  emptyState: ReactNode;
  errorState: ReactNode;
  forbiddenState?: ReactNode;
  offlineState?: ReactNode;
}

export const SixStatesMatrix: FC<SixStatesMatrixProps> = ({
  title = "Component 6-State Resilience Matrix",
  defaultState,
  loadingState,
  emptyState,
  errorState,
  forbiddenState,
  offlineState,
}) => {
  const states = [
    { label: "1. Default / Populated State", component: defaultState },
    { label: "2. Loading / Skeleton State", component: loadingState },
    { label: "3. Empty State", component: emptyState },
    { label: "4. Error State", component: errorState },
    ...(forbiddenState ? [{ label: "5. Forbidden / 403 State", component: forbiddenState }] : []),
    ...(offlineState ? [{ label: "6. Offline / Disconnected State", component: offlineState }] : []),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4)" }}>
      <h3 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 700 }}>{title}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "var(--space-4)" }}>
        {states.map(({ label, component }) => (
          <div
            key={label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
              padding: "var(--space-4)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              background: "var(--color-surface)",
            }}
          >
            <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-brand)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {label}
            </span>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>{component}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
