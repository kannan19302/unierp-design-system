"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { PanelLeft, PanelRight } from "lucide-react";
import styles from "./studio-shell.module.css";

/**
 * `<StudioShell>` — the frame every builder in the Developer Platform renders
 * inside.
 *
 * Why this exists at all: the platform had thirteen builder surfaces and
 * thirteen different chromes. Each one invented its own rail widths, its own
 * collapse behaviour, its own toolbar order and its own idea of where errors
 * appear. UI_UX_BRIEF's third design law ("learning one module must teach you
 * all 45") cannot survive that, and no amount of shared *tokens* fixes it —
 * layout is the part that was diverging.
 *
 * The contract, from UI_UX_BRIEF §12:
 *
 * 1. The canvas is the page. Chrome collapses; the artefact never does.
 * 2. Studio chrome uses `--studio-*`; canvas content uses the tenant's
 *    semantic tokens, so the tool never looks like the thing being built.
 * 3. The same five verbs in the same place, in every builder (see
 *    `<StudioToolbar>`).
 * 4. Nothing publishes silently (see `<PublishDiffDialog>`).
 *
 * Slots rather than props-for-everything: a builder supplies WHAT goes in each
 * zone, never HOW the zones are arranged. That is the whole point — a builder
 * that could move its own inspector would reintroduce the divergence this
 * component exists to end.
 */

export interface StudioShellContextValue {
  paletteOpen: boolean;
  inspectorOpen: boolean;
  togglePalette: () => void;
  toggleInspector: () => void;
}

const StudioShellContext = createContext<StudioShellContextValue | null>(null);

/**
 * Below these widths a rail must actually swap to its handle, not merely get a
 * narrower grid column. A media query can narrow the column but cannot change
 * what React renders into it — the first version did exactly that, and at
 * 687px the palette rendered its full contents into a 44px column: search box,
 * group headings and every item, all squashed into an unreadable stripe. The
 * breakpoints are duplicated here from studio.css because JS and CSS cannot
 * share a custom property in a media query; `studio-shell.test.tsx` asserts the
 * two stay equal rather than trusting this comment.
 */
export const STUDIO_BP_INSPECTOR = 1180;
export const STUDIO_BP_PALETTE = 900;

/**
 * `false` during SSR and on the first client render, so the markup the server
 * produced and the markup the client hydrates with are identical. Reacting to
 * the real viewport one commit later costs a frame; guessing it during render
 * costs a hydration mismatch.
 */
function useNarrowerThan(px: number): boolean {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(`(max-width: ${px}px)`);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [px]);

  return narrow;
}

/**
 * Lets a nested control (a toolbar button, a canvas empty state offering
 * "open the palette") drive the rails without every builder having to thread
 * the state down by hand.
 */
export function useStudioShell(): StudioShellContextValue {
  const ctx = useContext(StudioShellContext);
  if (!ctx) {
    throw new Error("useStudioShell must be used inside <StudioShell>");
  }
  return ctx;
}

export interface StudioShellProps {
  /** The five-verb bar. Almost always `<StudioToolbar>`. */
  toolbar?: ReactNode;
  /** Left rail — the insert source. Almost always `<StudioPalette>`. */
  palette?: ReactNode;
  /** The artefact itself. Almost always `<StudioCanvas>`. */
  canvas: ReactNode;
  /** Right rail — typed properties. Almost always `<StudioInspector>`. */
  inspector?: ReactNode;
  /** Bottom drawer — problems, output, logs. `<StudioConsole>`. */
  console?: ReactNode;
  /** Start with the palette collapsed (a builder with nothing to insert). */
  defaultPaletteOpen?: boolean;
  /** Start with the inspector collapsed (nothing selected yet). */
  defaultInspectorOpen?: boolean;
  /** Announced as the label of the shell's `<main>` landmark. */
  label: string;
}

export const StudioShell: FC<StudioShellProps> = ({
  toolbar,
  palette,
  canvas,
  inspector,
  console: consoleSlot,
  defaultPaletteOpen = true,
  defaultInspectorOpen = true,
  label,
}) => {
  // `null` means "no opinion yet — follow the viewport". Once the user touches
  // a handle their choice wins, at any width. A narrow window sets the DEFAULT;
  // it must not lock the rail shut, or the handle it renders is a control that
  // does nothing when pressed — which is worse than no handle at all.
  const [paletteChoice, setPaletteChoice] = useState<boolean | null>(null);
  const [inspectorChoice, setInspectorChoice] = useState<boolean | null>(null);

  const tooNarrowForInspector = useNarrowerThan(STUDIO_BP_INSPECTOR);
  const tooNarrowForPalette = useNarrowerThan(STUDIO_BP_PALETTE);

  // The inspector sheds first — a property panel is useless once the thing it
  // edits is off screen.
  const paletteOpen =
    paletteChoice ?? (defaultPaletteOpen && !tooNarrowForPalette);
  const inspectorOpen =
    inspectorChoice ?? (defaultInspectorOpen && !tooNarrowForInspector);

  const togglePalette = useCallback(
    () => setPaletteChoice(!paletteOpen),
    [paletteOpen],
  );
  const toggleInspector = useCallback(
    () => setInspectorChoice(!inspectorOpen),
    [inspectorOpen],
  );

  const ctx = useMemo(
    () => ({ paletteOpen, inspectorOpen, togglePalette, toggleInspector }),
    [paletteOpen, inspectorOpen, togglePalette, toggleInspector],
  );

  // Both widths are always supplied, never left to the stylesheet's fallback.
  // That is what keeps "is this rail collapsed?" a single decision: the same
  // boolean picks the column width and picks whether the rail renders its
  // contents or its handle, so the two can never disagree.
  //
  // A rail the user opens on a narrow window keeps its full width and the
  // canvas takes what is left. That is a deliberate trade: the alternative
  // (overlaying the canvas) hides the artefact behind the tool, and the rails
  // already default to collapsed at these widths, so a user who opens one has
  // asked for it.
  const style = {
    ["--paletteW" as string]: paletteOpen
      ? "var(--studio-rail-palette-w, 232px)"
      : "var(--studio-rail-collapsed-w, 44px)",
    ["--inspectorW" as string]: inspectorOpen
      ? "var(--studio-rail-inspector-w, 280px)"
      : "var(--studio-rail-collapsed-w, 44px)",
  } as React.CSSProperties;

  return (
    <StudioShellContext.Provider value={ctx}>
      <main className={styles.shell} style={style} aria-label={label}>
        {toolbar ? <div className={styles.toolbar}>{toolbar}</div> : null}

        {palette ? (
          <div
            className={`${styles.palette} ${paletteOpen ? "" : styles.railCollapsed}`}
          >
            {paletteOpen ? (
              palette
            ) : (
              <button
                type="button"
                className={styles.railHandle}
                onClick={togglePalette}
                aria-expanded={false}
                aria-label="Show the palette"
              >
                <PanelLeft size={14} aria-hidden="true" />
                Palette
              </button>
            )}
          </div>
        ) : null}

        <div className={styles.canvas}>{canvas}</div>

        {inspector ? (
          <div
            className={`${styles.inspector} ${inspectorOpen ? "" : styles.railCollapsed}`}
          >
            {inspectorOpen ? (
              inspector
            ) : (
              <button
                type="button"
                className={styles.railHandle}
                onClick={toggleInspector}
                aria-expanded={false}
                aria-label="Show the inspector"
              >
                <PanelRight size={14} aria-hidden="true" />
                Inspector
              </button>
            )}
          </div>
        ) : null}

        {consoleSlot ? (
          <div className={styles.console}>{consoleSlot}</div>
        ) : null}
      </main>
    </StudioShellContext.Provider>
  );
};
