import { type FC, type ReactNode } from "react";
import styles from "./editorial-shell.module.css";

/**
 * `<EditorialShell>` — anatomy 2 of the eleven in UI_UX_BRIEF §11.
 * The marketing site, and nothing else.
 *
 * ── Why the marketing site gets its own shell ──
 * Every other anatomy in the suite frames an *application*: it owns a rail, a
 * header of a fixed height, a content well, and it assumes the reader is signed
 * in and mid-task. A buyer reading a pricing page is none of those things, and
 * giving them the app frame is how a product's marketing surface ends up
 * looking like its own admin console.
 *
 * The structural difference is the band. In the product a section is a card
 * with a border on one continuous ground; here a section is a full-bleed
 * horizon and the grounds alternate. That is not decoration — it is what lets a
 * page be read at a scroll rather than scanned at a glance, which is the only
 * job this surface has.
 *
 * ── What it deliberately does NOT share ──
 * `--header-height`. Every in-product surface reads that token so the chrome
 * lines up between them; matching the app's 56px here would make the first
 * thing a buyer sees feel like a console. The masthead sets its own.
 *
 * ── What it still shares ──
 * Everything in §11.1: tokens, the six states, form conventions, the motion
 * budget, WCAG 2.2 AA — and the `MeridianBar` where a marketing surface has an
 * identity and a next verb worth stating. Anatomy is free; vocabulary is not.
 */

export type BandTone = "base" | "sunken" | "ink" | "signal";

// `string | undefined` because tsconfig.base.json sets noUncheckedIndexedAccess
// and a CSS-module lookup is an index access. The values are only ever
// interpolated into a className string, where undefined is harmless.
const BAND_CLASS: Record<BandTone, string | undefined> = {
  base: styles.band_base,
  sunken: styles.band_sunken,
  ink: styles.band_ink,
  signal: styles.band_signal,
};

export interface EditorialBandProps {
  /**
   * The ground this band sits on. Alternate them down the page — two adjacent
   * bands on the same tone read as one band with a gap in it.
   *
   * `signal` is the coral ground and is the ONLY sanctioned use of
   * `--brand-signal` anywhere in the platform (§13.1). Use it once per page at
   * most; a page with three signal bands has no signal.
   */
  tone?: BandTone;
  /**
   * `editorial` splits the measure 7/5 and holds it off-centre — the layout
   * that makes a marketing page read as designed rather than as a template.
   * `centred` is the plain bounded column for long-form copy.
   */
  layout?: "centred" | "editorial";
  id?: string;
  className?: string;
  children?: ReactNode;
}

export const EditorialBand: FC<EditorialBandProps> = ({
  tone = "base",
  layout = "centred",
  id,
  className = "",
  children,
}) => (
  <section
    id={id}
    className={`${styles.band} ${BAND_CLASS[tone]} ${className}`.trim()}
    data-band-tone={tone}
  >
    <div className={layout === "editorial" ? styles.inner_editorial : styles.inner}>
      {children}
    </div>
  </section>
);

export interface EditorialShellProps {
  /** The masthead's left side — wordmark, primary nav. */
  brand?: ReactNode;
  /** The masthead's right side — sign in, the one call to action. */
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export const EditorialShell: FC<EditorialShellProps> = ({
  brand,
  actions,
  footer,
  className = "",
  children,
}) => (
  <div className={`${styles.root} ${className}`.trim()}>
    {(brand || actions) && (
      // A real <header> landmark, not a styled div — a buyer using a screen
      // reader navigates this page by landmark exactly like any other.
      <header className={styles.masthead}>
        <div>{brand}</div>
        <div>{actions}</div>
      </header>
    )}

    <main className={styles.main}>{children}</main>

    {footer && <footer className={styles.footer}>{footer}</footer>}
  </div>
);

/* ── Type primitives ──
   Exported separately because a marketing page composes them directly rather
   than receiving them as props: an editorial layout is written, not configured.
   They exist here so the sizes stay in one place instead of every page picking
   its own clamp. */

export const Eyebrow: FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <p className={`${styles.eyebrow} ${className}`.trim()}>{children}</p>;

export const HeroTitle: FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <h1 className={`${styles.hero} ${className}`.trim()}>{children}</h1>;

export const BandTitle: FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <h2 className={`${styles.title} ${className}`.trim()}>{children}</h2>;

export const Lede: FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <p className={`${styles.lede} ${styles.measure} ${className}`.trim()}>{children}</p>;
