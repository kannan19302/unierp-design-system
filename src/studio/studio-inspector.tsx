"use client";

import { useId, useState, type FC, type ReactNode } from "react";
import styles from "./studio-inspector.module.css";

/**
 * `<StudioInspector>` — the right rail, and the reason four builders can drop
 * their modals.
 *
 * UI_UX_BRIEF §10 forbids modal-on-modal, and the builders were heading
 * straight for it: `GenericBuilderModal` and `FormLogicModal` opened over a
 * canvas that already had a properties dialog. Editing a property is not a
 * decision that needs the rest of the screen taken away — it needs the canvas
 * still visible so the user can see what their change did. That is what a rail
 * gives and a modal cannot.
 *
 * Four tabs, fixed, for the same consistency reason as the toolbar's five
 * verbs. A builder that has nothing to put in `style` passes nothing and the
 * tab renders its placeholder rather than vanishing, so the tab row does not
 * change shape between artefacts.
 */

export type InspectorTabId = "properties" | "logic" | "style" | "advanced";

const TAB_ORDER: { id: InspectorTabId; label: string }[] = [
  { id: "properties", label: "Properties" },
  { id: "logic", label: "Logic" },
  { id: "style", label: "Style" },
  { id: "advanced", label: "Advanced" },
];

export interface StudioInspectorProps {
  /** What is being inspected, e.g. "Email field". Announced with the region. */
  subject?: string;
  properties?: ReactNode;
  logic?: ReactNode;
  style?: ReactNode;
  advanced?: ReactNode;
  /** Shown across all tabs when nothing is selected. */
  emptyState?: ReactNode;
}

export const StudioInspector: FC<StudioInspectorProps> = ({
  subject,
  properties,
  logic,
  style,
  advanced,
  emptyState,
}) => {
  const [active, setActive] = useState<InspectorTabId>("properties");
  const baseId = useId();
  const panes: Record<InspectorTabId, ReactNode> = {
    properties,
    logic,
    style,
    advanced,
  };

  const nothingSelected = !subject;

  return (
    <div
      className={styles.inspector}
      role="region"
      aria-label={subject ? `Inspector — ${subject}` : "Inspector"}
    >
      <div className={styles.tabs} role="tablist" aria-label="Inspector sections">
        {TAB_ORDER.map((tab) => (
          <button
            key={tab.id}
            type="button"
            id={`${baseId}-tab-${tab.id}`}
            className={`${styles.tab} ${active === tab.id ? styles.tabActive : ""}`}
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className={styles.body}
        role="tabpanel"
        id={`${baseId}-panel-${active}`}
        aria-labelledby={`${baseId}-tab-${active}`}
        tabIndex={0}
      >
        {nothingSelected ? (
          emptyState ?? (
            <p className={styles.placeholder}>
              Select something on the canvas to edit its properties.
            </p>
          )
        ) : (
          panes[active] ?? (
            <p className={styles.placeholder}>
              {subject} has no {active} settings.
            </p>
          )
        )}
      </div>
    </div>
  );
};
