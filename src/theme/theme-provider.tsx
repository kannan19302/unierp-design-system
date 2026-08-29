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
import {
  THEMES,
  DENSITIES,
  PLATFORMS,
  LEGACY_THEMES,
  type ThemeName,
  type DensityName,
  type PlatformName,
} from "../tokens";

/** 'system' resolves to light or dark from the OS preference. */
export type ThemeSetting = ThemeName | "system";

export interface BrandingTokens {
  /** CSS custom properties, e.g. { '--color-primary': '#0055aa' }. */
  [cssVar: `--${string}`]: string;
}

interface ThemeContextValue {
  /** The user's chosen setting (may be 'system'). */
  setting: ThemeSetting;
  /** The concrete theme currently applied to <html data-theme>. */
  resolvedTheme: ThemeName;
  setTheme: (setting: ThemeSetting) => void;
  /** Inject customer-branding tokens at runtime (CSS vars on <html>). */
  applyBranding: (tokens: BrandingTokens) => void;
  clearBranding: () => void;
  themes: readonly ThemeName[];
  /** Layout density (spacing/typography scale), orthogonal to color theme. */
  density: DensityName;
  setDensity: (density: DensityName) => void;
  densities: readonly DensityName[];
  /**
   * DL 2.0: Active platform identity, applied as [data-platform] on <html>.
   * Controls which platform accent tokens are active.
   */
  platform: PlatformName | null;
  setPlatform: (platform: PlatformName | null) => void;
  platforms: readonly PlatformName[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "unierp.theme";
const LEGACY_STORAGE_KEY = "unerp.theme";
const BRANDING_KEY = "unierp.branding";
const LEGACY_BRANDING_KEY = "unerp.branding";
const DENSITY_KEY = "unierp.density";
const LEGACY_DENSITY_KEY = "unerp.density";
const PLATFORM_KEY = "unierp.platform";
const THEME_COOKIE = "unierp_theme";

function cookieValue(name: string): string | null {
  const item = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
}

function persistCookie(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function systemTheme(): ThemeName {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "meridian-dark";
  }
  return "meridian";
}

function isThemeSetting(value: string | null): value is ThemeSetting {
  return (
    value === "system" || (THEMES as readonly string[]).includes(value ?? "")
  );
}

function isDensity(value: string | null): value is DensityName {
  return (DENSITIES as readonly string[]).includes(value ?? "");
}

function isPlatform(value: string | null): value is PlatformName {
  return (PLATFORMS as readonly string[]).includes(value ?? "");
}

/**
 * Warn once at runtime when a consumer uses a deprecated legacy theme.
 * Build-time enforcement comes from scripts/check-tokens.mjs.
 */
const warnedLegacy = new Set<string>();
function warnLegacyTheme(theme: ThemeName): void {
  if (
    (LEGACY_THEMES as readonly string[]).includes(theme) &&
    !warnedLegacy.has(theme)
  ) {
    warnedLegacy.add(theme);
    console.warn(
      `[UniERP DL 2.0] Theme "${theme}" is deprecated. ` +
        `Migrate to "meridian", "meridian-dark", or "high-contrast". ` +
        `Legacy themes will be removed in the next major version.`,
    );
  }
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Initial setting when nothing is persisted. Defaults to 'meridian'. */
  defaultSetting?: ThemeSetting;
  /**
   * Initial density when nothing is persisted.
   * DL 2.0 default: 'standard'. V1 consumers: set to 'comfortable'.
   */
  defaultDensity?: DensityName;
  /** Initial platform identity. Usually set by the platform shell. */
  defaultPlatform?: PlatformName | null;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  defaultSetting = "meridian",
  defaultDensity = "standard",
  defaultPlatform = null,
}: any) => {
  const [setting, setSetting] = useState<ThemeSetting>(defaultSetting);
  const [resolvedTheme, setResolvedTheme] = useState<ThemeName>(
    defaultSetting === "system" ? "meridian" : defaultSetting,
  );
  const [density, setDensityState] = useState<DensityName>(defaultDensity);
  const [platform, setPlatformState] = useState<PlatformName | null>(
    defaultPlatform,
  );

  // Hydrate persisted setting + branding + platform on mount.
  useEffect(() => {
    const stored = cookieValue(THEME_COOKIE) ??
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (isThemeSetting(stored)) setSetting(stored);
    const storedDensity = window.localStorage.getItem(DENSITY_KEY) ??
      window.localStorage.getItem(LEGACY_DENSITY_KEY);
    if (isDensity(storedDensity)) setDensityState(storedDensity);
    const storedPlatform = window.localStorage.getItem(PLATFORM_KEY);
    if (isPlatform(storedPlatform)) setPlatformState(storedPlatform);
    const branding = window.localStorage.getItem(BRANDING_KEY) ??
      window.localStorage.getItem(LEGACY_BRANDING_KEY);
    if (branding) {
      try {
        const tokens = JSON.parse(branding) as BrandingTokens;
        for (const [key, value] of Object.entries(tokens)) {
          if (key.startsWith("--"))
            document.documentElement.style.setProperty(key, value);
        }
      } catch {
        window.localStorage.removeItem(BRANDING_KEY);
      }
    }
  }, []);

  // Apply the resolved theme and track OS preference while on 'system'.
  useEffect(() => {
    const apply = () => {
      const next = setting === "system" ? systemTheme() : setting;
      setResolvedTheme(next);
      document.documentElement.setAttribute("data-theme", next);
      warnLegacyTheme(next);
    };
    apply();
    if (setting !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [setting]);

  // Apply density to <html data-density> whenever it changes.
  useEffect(() => {
    document.documentElement.setAttribute("data-density", density);
  }, [density]);

  // Apply platform identity to <html data-platform> whenever it changes.
  useEffect(() => {
    if (platform) {
      document.documentElement.setAttribute("data-platform", platform);
    } else {
      document.documentElement.removeAttribute("data-platform");
    }
  }, [platform]);

  const setTheme = useCallback((next: ThemeSetting) => {
    setSetting(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    persistCookie(THEME_COOKIE, next);
  }, []);

  const setDensity = useCallback((next: DensityName) => {
    setDensityState(next);
    window.localStorage.setItem(DENSITY_KEY, next);
  }, []);

  const setPlatform = useCallback((next: PlatformName | null) => {
    setPlatformState(next);
    if (next) {
      window.localStorage.setItem(PLATFORM_KEY, next);
    } else {
      window.localStorage.removeItem(PLATFORM_KEY);
    }
  }, []);

  const applyBranding = useCallback((tokens: BrandingTokens) => {
    for (const [key, value] of Object.entries(tokens)) {
      if (key.startsWith("--"))
        document.documentElement.style.setProperty(key, value);
    }
    const serialized = JSON.stringify(tokens);
    window.localStorage.setItem(BRANDING_KEY, serialized);
    // One-release compatibility window for consumers still reading the old
    // misspelled key before they upgrade to the shared provider.
    window.localStorage.setItem(LEGACY_BRANDING_KEY, serialized);
  }, []);

  const clearBranding = useCallback(() => {
    const branding = window.localStorage.getItem(BRANDING_KEY);
    if (branding) {
      try {
        const tokens = JSON.parse(branding) as BrandingTokens;
        for (const key of Object.keys(tokens)) {
          document.documentElement.style.removeProperty(key);
        }
      } catch {
        /* already unparseable — nothing applied */
      }
    }
    window.localStorage.removeItem(BRANDING_KEY);
    window.localStorage.removeItem(LEGACY_BRANDING_KEY);
  }, []);

  const value = useMemo(
    () => ({
      setting,
      resolvedTheme,
      setTheme,
      applyBranding,
      clearBranding,
      themes: THEMES,
      density,
      setDensity,
      densities: DENSITIES,
      platform,
      setPlatform,
      platforms: PLATFORMS,
    }),
    [
      setting,
      resolvedTheme,
      setTheme,
      applyBranding,
      clearBranding,
      density,
      setDensity,
      platform,
      setPlatform,
    ],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a <ThemeProvider>");
  return ctx;
}

export function useOptionalTheme(): ThemeContextValue | null {
  return useContext(ThemeContext);
}

