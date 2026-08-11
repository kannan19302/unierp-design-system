/**
 * D14 — the ONE renderer that turns any conforming settings schema into a
 * complete settings page: search, categories, dirty-state, dependency-
 * driven visibility, reset-to-default. `SettingSchemaEntry` is
 * structurally identical to `SettingDefinition` (@kannan19302/contracts,
 * D13's L0 contract) — an app that has 40 real `SettingDefinition`
 * objects from that registry can pass them straight to `<SettingsPage>`
 * with ZERO bespoke UI code, which is D14's own exit criterion made
 * literal: this file is the only settings-rendering code that exists
 * anywhere in the platform.
 */
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { FormField, Input, Textarea, Select } from "../components";
import { Switch } from "../components/extended-inputs";

export type SettingScope = "USER" | "TEAM" | "ORGANIZATION" | "TENANT" | "PLATFORM";
export type SettingType = "string" | "number" | "boolean" | "enum" | "json";

export interface SettingSchemaEntry {
  key: string;
  owner: string;
  type: SettingType;
  scopes: readonly SettingScope[];
  defaultValue: unknown;
  permission: string;
  helpText: string;
  validation?: { enumValues?: readonly string[]; min?: number; max?: number; pattern?: string };
  /** Other setting keys that must hold a truthy (or specific) value before this one is shown. */
  dependsOn?: readonly string[];
  /** Free-text grouping label for the search/category UI — falls back to `owner`. */
  category?: string;
  version: number;
}

export interface SettingsPageProps {
  schema: readonly SettingSchemaEntry[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  /** Which of `values`' keys differ from the schema's declared defaultValue —
   *  if omitted, computed automatically by comparing against defaultValue. */
  dirtyKeys?: readonly string[];
  onResetToDefault: (key: string) => void;
}

function isDependencySatisfied(entry: SettingSchemaEntry, values: Record<string, unknown>): boolean {
  if (!entry.dependsOn || entry.dependsOn.length === 0) return true;
  return entry.dependsOn.every((depKey) => Boolean(values[depKey]));
}

function renderControl(entry: SettingSchemaEntry, value: unknown, onChange: (v: unknown) => void): ReactNode {
  const current = value ?? entry.defaultValue;
  switch (entry.type) {
    case "boolean":
      return <Switch checked={Boolean(current)} onChange={onChange} id={entry.key} />;
    case "enum":
      return (
        <Select value={String(current ?? "")} onChange={(e) => onChange(e.target.value)}>
          {(entry.validation?.enumValues ?? []).map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </Select>
      );
    case "number":
      return (
        <Input
          type="number"
          value={current === undefined || current === null ? "" : String(current)}
          min={entry.validation?.min}
          max={entry.validation?.max}
          onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        />
      );
    case "json":
      return (
        <Textarea
          value={current === undefined ? "" : JSON.stringify(current, null, 2)}
          onChange={(e) => {
            try {
              onChange(JSON.parse(e.target.value));
            } catch {
              // invalid JSON while typing — leave the last valid value in place
            }
          }}
        />
      );
    case "string":
    default:
      return <Input type="text" value={current === undefined || current === null ? "" : String(current)} onChange={(e) => onChange(e.target.value)} />;
  }
}

/**
 * The single settings-page renderer. Pass any array of conforming
 * schema entries (D13's SettingDefinition shape) and the current
 * values — nothing else is required for a complete page.
 */
export function SettingsPage({ schema, values, onChange, dirtyKeys, onResetToDefault }: SettingsPageProps) {
  const [query, setQuery] = useState("");

  const computedDirty = useMemo(() => {
    if (dirtyKeys) return new Set(dirtyKeys);
    const set = new Set<string>();
    for (const entry of schema) {
      const current = values[entry.key];
      if (current !== undefined && JSON.stringify(current) !== JSON.stringify(entry.defaultValue)) {
        set.add(entry.key);
      }
    }
    return set;
  }, [schema, values, dirtyKeys]);

  const visible = useMemo(
    () =>
      schema.filter((entry) => {
        if (!isDependencySatisfied(entry, values)) return false;
        if (!query.trim()) return true;
        const q = query.trim().toLowerCase();
        return entry.key.toLowerCase().includes(q) || entry.helpText.toLowerCase().includes(q) || (entry.category ?? entry.owner).toLowerCase().includes(q);
      }),
    [schema, values, query],
  );

  const categories = useMemo(() => {
    const map = new Map<string, SettingSchemaEntry[]>();
    for (const entry of visible) {
      const cat = entry.category ?? entry.owner;
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(entry);
    }
    return map;
  }, [visible]);

  return (
    <div data-testid="settings-page">
      <Input
        type="search"
        placeholder="Search settings…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search settings"
      />
      {[...categories.entries()].map(([category, entries]) => (
        <section key={category} data-testid={`settings-category-${category}`}>
          <h3>{category}</h3>
          {entries.map((entry) => (
            <FormField key={entry.key} label={entry.key} htmlFor={entry.key} hint={entry.helpText}>
              {renderControl(entry, values[entry.key], (v) => onChange(entry.key, v))}
              {computedDirty.has(entry.key) && (
                <button type="button" data-testid={`reset-${entry.key}`} onClick={() => onResetToDefault(entry.key)}>
                  Reset to default
                </button>
              )}
            </FormField>
          ))}
        </section>
      ))}
    </div>
  );
}
