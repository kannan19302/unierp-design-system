/**
 * `platform.manifest.ts` — the declaration every platform provides instead of
 * hand-wiring its own nav and permission checks.
 *
 * The plan's reasoning for this file existing at all: "Each platform declares
 * a platform.manifest.ts (code, nav tree, route → required permission map).
 * Guards read the manifest instead of hardcoding, which is what makes adding a
 * new page later a one-line change." Concretely: today, adding a page to
 * tenant-apps means editing a nav array in one file, a route guard in another,
 * and (per the codebase's own five-parallel-lists problem documented in the
 * platform plan) sometimes a third. A manifest collapses that to one array
 * entry that both the sidebar renderer and the route guard read.
 *
 * This module only defines the SHAPE. Each platform's own
 * `app/platform.manifest.ts` is data (see tenant-apps for the first
 * consumer, in W6) — this package has no opinion on what any platform's nav
 * tree actually contains.
 */

export interface PlatformNavItem {
  key: string;
  label: string;
  href: string;
  /** Lucide icon name, resolved by the consuming app — kept as a string here
   * so this schema has no dependency on lucide-react or any icon set. */
  icon?: string;
  /** Every permission listed must be held for this item to render at all. */
  requiredPermissions?: string[];
  children?: PlatformNavItem[];
}

export interface PlatformManifest {
  /** P1..P10 — must match a code seeded in idp's Platform table. */
  platformCode: string;
  platformName: string;
  nav: PlatformNavItem[];
  /**
   * Route prefix → permissions required to enter it. Consumed by each
   * platform's own middleware via `requirePermissions` from
   * `@kannan19302/shared/auth-client` — the manifest is the single place that
   * mapping is declared; the guard is generic over it.
   */
  routePermissions: Record<string, string[]>;
}

/**
 * Filters a manifest's nav tree down to what the given permission set
 * actually admits — recursively, so a parent with no visible children is
 * itself dropped rather than rendering an empty disclosure group.
 *
 * `matches` exists because this package must not depend on
 * `@kannan19302/shared` (that would pull zod, jose and date-fns into every
 * consumer of the design system for one predicate), yet the default
 * exact-match is NOT the platform's real permission semantics: the API
 * authorizes with a wildcard-aware `hasPermission` from
 * `@kannan19302/shared`, where a role holding `builder.*` satisfies
 * `builder.manage`. With plain `includes()`, such a role renders a nav that
 * hides items the backend would happily serve — a real mismatch, observed
 * with a tenant-admin holding `builder.*` losing the "Manage" entry.
 *
 * Consumers that authorize against wildcards should pass shared's
 * `hasPermission` here. The default is kept exact so this stays a
 * behaviour-preserving change for anyone already calling it.
 */
export function resolveManifestNav(
  manifest: PlatformManifest,
  heldPermissions: string[],
  matches: (held: string[], required: string) => boolean = (held, required) =>
    held.includes(required),
): PlatformNavItem[] {
  const filterItems = (items: PlatformNavItem[]): PlatformNavItem[] =>
    items.reduce<PlatformNavItem[]>((visible, item) => {
      const admitted =
        !item.requiredPermissions ||
        item.requiredPermissions.every((p) => matches(heldPermissions, p));
      if (!admitted) return visible;

      const children = item.children ? filterItems(item.children) : undefined;
      if (item.children && children && children.length === 0) {
        // A parent whose entire children set is hidden has nothing left to
        // disclose; showing it anyway is a dead-end menu item.
        return visible;
      }

      visible.push(children ? { ...item, children } : item);
      return visible;
    }, []);

  return filterItems(manifest.nav);
}
