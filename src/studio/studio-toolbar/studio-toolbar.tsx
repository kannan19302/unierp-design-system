"use client";

import { forwardRef, type ReactNode } from "react";
import {
  Check,
  CheckCircle2,
  Eye,
  History,
  Laptop,
  PlayCircle,
  Rocket,
  Smartphone,
  Tablet,
  ChevronDown,
} from "lucide-react";
import { Button } from "../../primitives/button";
import styles from "./studio-toolbar.module.css";

export interface StudioVerb {
  onAction?: () => void;
  /** Why this verb is unavailable here. Surfaced as the control's title. */
  disabledReason?: string;
  /** In-flight (publishing, running). Renders the button's own spinner. */
  busy?: boolean;
}

export type DevicePreviewMode = "desktop" | "tablet" | "mobile";

export interface StudioToolbarProps {
  /** The artefact's name — what the user thinks they are editing. */
  name: string;
  /** e.g. "Form", "Flow", "Dashboard". Sits beside the name. */
  kind?: string;
  /** Unsaved changes exist. Rendered as a dot AND the word "Unsaved". */
  dirty?: boolean;
  /** e.g. "v12 · live" — the version chip. */
  version?: string;
  /** Number of problems in the console. Badges the Validate verb. */
  problemCount?: number;
  /** The environment this artefact publishes to. Usually a `<Select>`. */
  environment?: ReactNode;
  /** The artefact's canonical address or breadcrumb trail. */
  address?: ReactNode;
  /** Breadcrumb hierarchy array or node, e.g. ["Acme Corp", "Supplier portal", "Development", "Draft"] */
  breadcrumbs?: ReactNode | string[];
  /** Live save status indicator */
  saveStatus?: "saved" | "saving" | "unsaved";
  /** Canvas navigation tabs, e.g. Website / Design / Content / Interactions */
  canvasTabs?: ReactNode;
  /** Active device preview mode */
  deviceMode?: DevicePreviewMode;
  /** Callback fired when device preview mode changes */
  onDeviceModeChange?: (mode: DevicePreviewMode) => void;
  /** Canvas zoom level percentage (e.g. 100) */
  zoomPercent?: number;
  /** Callback fired when zoom level changes */
  onZoomChange?: (zoom: number) => void;
  /** Primary prominent action button (e.g. "Review release") */
  primaryAction?: ReactNode;
  /** Secondary action button (e.g. "Preview") */
  secondaryAction?: ReactNode;

  validate?: StudioVerb;
  preview?: StudioVerb;
  testRun?: StudioVerb;
  version_?: StudioVerb;
  publish?: StudioVerb;
}

const verbProps = (verb: StudioVerb | undefined) => ({
  onClick: verb?.onAction,
  disabled: !verb?.onAction || verb?.busy,
  isLoading: verb?.busy,
  title: verb?.disabledReason,
});

/**
 * `<StudioToolbar>` — Universal control bar for Strata Studio and Developer Platform builders.
 * Integrates breadcrumbs, auto-save status, device preview switchers, zoom controls, and standard verbs.
 *
 * @maturity stable
 */
export const StudioToolbar = forwardRef<HTMLDivElement, StudioToolbarProps>(({
  name,
  kind,
  dirty = false,
  version,
  problemCount = 0,
  environment,
  address,
  breadcrumbs,
  saveStatus,
  canvasTabs,
  deviceMode = "desktop",
  onDeviceModeChange,
  zoomPercent,
  onZoomChange,
  primaryAction,
  secondaryAction,
  validate,
  preview,
  testRun,
  version_,
  publish,
}, ref) => {
  return (
    <div
      ref={ref}
      className={styles.toolbar}
      role="toolbar"
      aria-label={`${name} actions`}
    >
      <div className={styles.identity}>
        {breadcrumbs ? (
          <div className={styles.breadcrumbNav}>
            {Array.isArray(breadcrumbs) ? (
              <span className={styles.breadcrumbTrail}>
                {breadcrumbs.map((crumb, idx) => (
                  <span key={idx} className={styles.crumbItem}>
                    {idx > 0 && <span className={styles.crumbSeparator}>/</span>}
                    <span className={idx === breadcrumbs.length - 1 ? styles.crumbTerminal : styles.crumbAncestor}>
                      {crumb}
                    </span>
                  </span>
                ))}
              </span>
            ) : (
              breadcrumbs
            )}
          </div>
        ) : (
          <>
            <span className={styles.name} title={name}>
              {name}
            </span>
            {kind ? <span className={styles.meta}>{kind}</span> : null}
            {address ? <span className={styles.address}>{address}</span> : null}
            {version ? <span className={styles.meta}>{version}</span> : null}
          </>
        )}

        {saveStatus === "saved" ? (
          <span className={styles.savedStatus}>
            <Check size={12} className={styles.savedCheck} aria-hidden="true" />
            Saved
          </span>
        ) : saveStatus === "saving" ? (
          <span className={styles.savingStatus}>Saving...</span>
        ) : (dirty || saveStatus === "unsaved") ? (
          <span className={styles.dirty}>
            <span className={styles.dirtyDot} aria-hidden="true" />
            Unsaved
          </span>
        ) : null}
      </div>

      {canvasTabs && <div className={styles.canvasTabsWrapper}>{canvasTabs}</div>}

      {onDeviceModeChange && (
        <div className={styles.deviceModeSwitch} role="group" aria-label="Device preview mode">
          <button
            type="button"
            className={`${styles.deviceBtn} ${deviceMode === "desktop" ? styles.deviceBtnActive : ""}`}
            onClick={() => onDeviceModeChange("desktop")}
            aria-label="Desktop preview"
            aria-pressed={deviceMode === "desktop"}
          >
            <Laptop size={14} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`${styles.deviceBtn} ${deviceMode === "tablet" ? styles.deviceBtnActive : ""}`}
            onClick={() => onDeviceModeChange("tablet")}
            aria-label="Tablet preview"
            aria-pressed={deviceMode === "tablet"}
          >
            <Tablet size={14} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`${styles.deviceBtn} ${deviceMode === "mobile" ? styles.deviceBtnActive : ""}`}
            onClick={() => onDeviceModeChange("mobile")}
            aria-label="Mobile preview"
            aria-pressed={deviceMode === "mobile"}
          >
            <Smartphone size={14} aria-hidden="true" />
          </button>
        </div>
      )}

      {zoomPercent !== undefined && (
        <button
          type="button"
          className={styles.zoomControl}
          onClick={() => onZoomChange?.(zoomPercent === 100 ? 75 : 100)}
          aria-label={`Zoom level ${zoomPercent} percent`}
        >
          <span className={styles.zoomLabel}>{zoomPercent}%</span>
          <ChevronDown size={12} className={styles.zoomChevron} aria-hidden="true" />
        </button>
      )}

      {environment ? <div className={styles.verbs}>{environment}</div> : null}

      <div className={styles.verbs}>
        {secondaryAction}

        <Button
          variant="ghost"
          size="sm"
          leftIcon={<CheckCircle2 size={14} aria-hidden="true" />}
          {...verbProps(validate)}
        >
          Validate
          {problemCount > 0 ? (
            <span className={styles.problemCount} aria-label={`${problemCount} problems`}>
              {problemCount}
            </span>
          ) : null}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Eye size={14} aria-hidden="true" />}
          {...verbProps(preview)}
        >
          Preview
        </Button>

        <Button
          variant="ghost"
          size="sm"
          leftIcon={<PlayCircle size={14} aria-hidden="true" />}
          {...verbProps(testRun)}
        >
          Test run
        </Button>

        <Button
          variant="ghost"
          size="sm"
          leftIcon={<History size={14} aria-hidden="true" />}
          {...verbProps(version_)}
        >
          Version
        </Button>

        <span className={styles.divider} aria-hidden="true" />

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Rocket size={14} aria-hidden="true" />}
          {...verbProps(publish)}
        >
          Publish
        </Button>

        {primaryAction}
      </div>
    </div>
  );
});

StudioToolbar.displayName = "StudioToolbar";
