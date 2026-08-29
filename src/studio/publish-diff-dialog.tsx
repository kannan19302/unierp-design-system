"use client";

import { type FC, type ReactNode } from "react";
import { Modal } from "../overlays/modal";
import { Button } from "../primitives/button";
import styles from "./publish-diff-dialog.module.css";

/**
 * `<PublishDiffDialog>` — UI_UX_BRIEF §12 rule 4: **nothing publishes
 * silently.**
 *
 * This is the one component in the Studio set that is a policy rather than a
 * convenience. Publishing is the moment a tenant's users start seeing a
 * change, and until now each builder had its own "Deploy" button that posted
 * and showed a toast. That is fine right up until an AI copilot, an import, or
 * a mis-click writes something nobody reviewed — and Track G's G29 exit
 * criterion is explicit that no AI-produced artefact reaches a tenant's data
 * without an explicit accept. One dialog, used by every publish path, is how
 * that is enforced rather than promised.
 *
 * Three things must always be on screen before the button is live:
 *   1. WHAT changes — a diff against the currently live version, not a count.
 *   2. WHERE it goes — the named environment, never implied.
 *   3. HOW to undo it — the version this rolls back to.
 *
 * A publish with an empty diff is refused rather than allowed as a no-op:
 * "publish" that changes nothing but bumps a version number is how audit
 * trails fill with noise.
 */

export interface PublishChange {
  id: string;
  kind: "added" | "removed" | "changed";
  /** What changed, in the user's vocabulary — "Email field", not "field[3]". */
  what: string;
  /** Optional before/after detail. */
  detail?: string;
}

export interface PublishDiffDialogProps {
  open: boolean;
  onClose: () => void;
  /** The artefact being published. */
  name: string;
  /** Where it goes. Named, never implied. */
  environment: string;
  /** The version this replaces — the rollback handle. */
  rollbackTo?: string;
  changes: PublishChange[];
  onPublish: () => void;
  publishing?: boolean;
  /** Extra content — a consent notice, an AI-authored warning. */
  children?: ReactNode;
}

// See studio-console.tsx for why this is `string | undefined`.
const KIND_CLASS: Record<PublishChange["kind"], string | undefined> = {
  added: styles.kindAdded,
  removed: styles.kindRemoved,
  changed: styles.kindChanged,
};

export const PublishDiffDialog: FC<PublishDiffDialogProps> = ({
  open,
  onClose,
  name,
  environment,
  rollbackTo,
  changes,
  onPublish,
  publishing = false,
  children,
}) => {
  const nothingToDo = changes.length === 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={`Publish ${name}`}
      description={`Review every change before it reaches ${environment}.`}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={publishing}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onPublish}
            isLoading={publishing}
            disabled={nothingToDo || publishing}
            title={
              nothingToDo
                ? "There is nothing to publish — the draft matches what is live."
                : undefined
            }
          >
            Publish to {environment}
          </Button>
        </>
      }
    >
      <div className={styles.target}>
        <span className={styles.targetLabel}>Target</span>
        <span className={styles.targetValue}>{environment}</span>
      </div>

      {children}

      {nothingToDo ? (
        <p className={styles.empty}>
          The draft is identical to what is already live. Nothing to publish.
        </p>
      ) : (
        <ul className={styles.diff} aria-label={`${changes.length} changes`}>
          {changes.map((c) => (
            <li key={c.id} className={styles.change}>
              <span className={`${styles.kind} ${KIND_CLASS[c.kind] ?? ""}`}>{c.kind}</span>
              <span className={styles.what}>
                {c.what}
                {c.detail ? <span className={styles.detail}>{c.detail}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      )}

      {rollbackTo ? (
        <p className={styles.rollback}>
          If this goes wrong, {environment} rolls back to {rollbackTo}.
        </p>
      ) : null}
    </Modal>
  );
};
