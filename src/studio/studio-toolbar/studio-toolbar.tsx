"use client";

import { type FC, type ReactNode } from "react";
import {
  CheckCircle2,
  Eye,
  History,
  PlayCircle,
  Rocket,
} from "lucide-react";
import { Button } from "../../primitives/button";

import styles from "./studio-toolbar.module.css";

/**
 * `<StudioToolbar>` — the five verbs, in the same order, in every builder.
 *
 * UI_UX_BRIEF §12 rule 3. The order is fixed by this component, not chosen by
 * the caller, and that is deliberate: the platform's third design law is
 * "learning one module must teach you all 45", and a toolbar whose order a
 * builder could rearrange is exactly how that promise was being broken. A
 * builder supplies handlers; it does not supply layout.
 *
 *   Validate · Preview · Test-run · Version · Publish
 *
 * A verb with no handler renders disabled rather than disappearing, so the
 * shape of the bar is identical everywhere and a user never has to re-find a
 * control that moved because this particular builder cannot do one of them.
 * `disabledReason` is what makes that honest — a disabled control with no
 * explanation is worse than an absent one.
 */

export interface StudioVerb {
  onAction?: () => void;
  /** Why this verb is unavailable here. Surfaced as the control's title. */
  disabledReason?: string;
  /** In-flight (publishing, running). Renders the button's own spinner. */
  busy?: boolean;
}

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
  /**
   * The artefact's canonical address — an `<ArtifactAddress>`.
   *
   * A full-canvas editor deliberately sheds every rail, which leaves the user
   * with no on-screen answer to "which app's form is this, and which version
   * am I looking at". The name alone does not answer it: six apps can each
   * have a form called "Leave request". This is the only place that identity
   * survives at full canvas, which is why it sits in the toolbar rather than
   * in chrome the editor hides.
   */
  address?: ReactNode;

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

export const StudioToolbar: FC<StudioToolbarProps> = ({
  name,
  kind,
  dirty = false,
  version,
  problemCount = 0,
  environment,
  address,
  validate,
  preview,
  testRun,
  version_,
  publish,
}) => (
  <div className={styles.toolbar} role="toolbar" aria-label={`${name} actions`}>
    <div className={styles.identity}>
      <span className={styles.name} title={name}>
        {name}
      </span>
      {kind ? <span className={styles.meta}>{kind}</span> : null}
      {address ? <span className={styles.address}>{address}</span> : null}
      {version ? <span className={styles.meta}>{version}</span> : null}
      {dirty ? (
        <span className={styles.dirty}>
          <span className={styles.dirtyDot} aria-hidden="true" />
          Unsaved
        </span>
      ) : null}
    </div>

    {environment ? <div className={styles.verbs}>{environment}</div> : null}

    <div className={styles.verbs}>
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
    </div>
  </div>
);
