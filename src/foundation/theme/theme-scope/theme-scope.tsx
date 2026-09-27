"use client";

import { forwardRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import type { DensityName, PlatformName, ThemeName } from "../../tokens";


export interface ThemeScopeProps {
  /** Optional theme override for this sub-tree (e.g. 'meridian', 'meridian-dark') */
  theme?: ThemeName;
  /** Optional density override for this sub-tree (e.g. 'compact', 'standard', 'comfortable') */
  density?: DensityName;
  /** Optional platform accent override for this sub-tree (e.g. 'developer', 'apps', 'ops') */
  platform?: PlatformName;
  children: ReactNode;
  /** Custom wrapper tag (defaults to 'div') */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/**
 * `<ThemeScope>` — Local sub-tree container for scoping themes, density, and platform accents.
 *
 * Use this component when embedding widgets, compact data grids, or multi-tenant panels
 * that require their own density or platform accent without altering the root `<html>` attributes.
 *
 * Example:
 * ```tsx
 * <ThemeScope density="compact" platform="ops">
 *   <LedgerTable data={records} />
 * </ThemeScope>
 * ```
 */
export const ThemeScope = forwardRef<HTMLElement, ThemeScopeProps>(
  (
    {
      theme,
      density,
      platform,
      children,
      as: Component = "div",
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        data-theme={theme}
        data-density={density}
        data-platform={platform}
        className={className}
        style={style}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

ThemeScope.displayName = "ThemeScope";
