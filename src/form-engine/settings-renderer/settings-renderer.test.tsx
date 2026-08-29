/**
 * D14 exit criterion: "A new app declaring 40 settings gets a complete
 * settings page with ZERO bespoke UI code." This spec proves it
 * directly: a synthetic 40-entry schema (mirroring D13's
 * SettingDefinition shape) is passed straight to <SettingsPage> with no
 * per-app rendering logic anywhere in this file.
 */
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SettingsPage, type SettingSchemaEntry } from "../settings-renderer";

function makeFortySettings(): SettingSchemaEntry[] {
  const entries: SettingSchemaEntry[] = [];
  for (let i = 0; i < 40; i++) {
    const types: SettingSchemaEntry["type"][] = ["string", "number", "boolean", "enum", "json"];
    const type = types[i % types.length];
    entries.push({
      key: `demoapp.setting${i}`,
      owner: "demoapp",
      type,
      scopes: ["TENANT"],
      defaultValue: type === "boolean" ? false : type === "number" ? 0 : type === "enum" ? "A" : type === "json" ? {} : "",
      permission: "demoapp.settings.manage",
      helpText: `Help text for setting ${i}`,
      validation: type === "enum" ? { enumValues: ["A", "B", "C"] } : undefined,
      category: i < 20 ? "General" : "Advanced",
      version: 1,
    });
  }
  return entries;
}

describe("D14 · SettingsPage — a complete settings page from a schema, zero bespoke UI code", () => {
  it("renders a COMPLETE page for 40 declared settings with no per-app code", () => {
    const schema = makeFortySettings();
    const values: Record<string, unknown> = {};
    render(<SettingsPage schema={schema} values={values} onChange={vi.fn()} onResetToDefault={vi.fn()} />);

    for (const entry of schema) {
      expect(screen.getByText(entry.key)).toBeInTheDocument();
    }
  });

  it("groups settings into CATEGORIES", () => {
    const schema = makeFortySettings();
    render(<SettingsPage schema={schema} values={{}} onChange={vi.fn()} onResetToDefault={vi.fn()} />);
    expect(screen.getByTestId("settings-category-General")).toBeInTheDocument();
    expect(screen.getByTestId("settings-category-Advanced")).toBeInTheDocument();
  });

  it("SEARCH filters to matching settings only", async () => {
    const schema = makeFortySettings();
    render(<SettingsPage schema={schema} values={{}} onChange={vi.fn()} onResetToDefault={vi.fn()} />);

    await userEvent.type(screen.getByLabelText("Search settings"), "setting5");

    expect(screen.getByText("demoapp.setting5")).toBeInTheDocument();
    expect(screen.queryByText("demoapp.setting0")).not.toBeInTheDocument();
  });

  it("DIRTY-STATE: a value that differs from the schema's default shows a reset control; the default value does not", () => {
    const schema = [makeFortySettings()[0]!];
    const { rerender } = render(
      <SettingsPage schema={schema} values={{ [schema[0]!.key]: schema[0]!.defaultValue }} onChange={vi.fn()} onResetToDefault={vi.fn()} />,
    );
    expect(screen.queryByTestId(`reset-${schema[0]!.key}`)).not.toBeInTheDocument();

    rerender(<SettingsPage schema={schema} values={{ [schema[0]!.key]: "changed-value" }} onChange={vi.fn()} onResetToDefault={vi.fn()} />);
    expect(screen.getByTestId(`reset-${schema[0]!.key}`)).toBeInTheDocument();
  });

  it("RESET-TO-DEFAULT calls back with the setting's key", async () => {
    const schema = [makeFortySettings()[0]!];
    const onReset = vi.fn();
    render(<SettingsPage schema={schema} values={{ [schema[0]!.key]: "changed" }} onChange={vi.fn()} onResetToDefault={onReset} />);

    await userEvent.click(screen.getByTestId(`reset-${schema[0]!.key}`));
    expect(onReset).toHaveBeenCalledWith(schema[0]!.key);
  });

  it("DEPENDENCY-DRIVEN VISIBILITY: a setting with an unmet dependsOn is hidden until the dependency is satisfied", () => {
    const base: SettingSchemaEntry = {
      key: "demoapp.enableAdvanced",
      owner: "demoapp",
      type: "boolean",
      scopes: ["TENANT"],
      defaultValue: false,
      permission: "p",
      helpText: "h",
      version: 1,
    };
    const dependent: SettingSchemaEntry = {
      key: "demoapp.advancedTimeout",
      owner: "demoapp",
      type: "number",
      scopes: ["TENANT"],
      defaultValue: 30,
      permission: "p",
      helpText: "h",
      dependsOn: ["demoapp.enableAdvanced"],
      version: 1,
    };

    const { rerender } = render(<SettingsPage schema={[base, dependent]} values={{ "demoapp.enableAdvanced": false }} onChange={vi.fn()} onResetToDefault={vi.fn()} />);
    expect(screen.queryByText("demoapp.advancedTimeout")).not.toBeInTheDocument();

    rerender(<SettingsPage schema={[base, dependent]} values={{ "demoapp.enableAdvanced": true }} onChange={vi.fn()} onResetToDefault={vi.fn()} />);
    expect(screen.getByText("demoapp.advancedTimeout")).toBeInTheDocument();
  });

  it("changing an enum control calls onChange with the selected value", () => {
    const schema: SettingSchemaEntry[] = [
      { key: "demoapp.theme", owner: "demoapp", type: "enum", scopes: ["TENANT"], defaultValue: "light", permission: "p", helpText: "h", validation: { enumValues: ["light", "dark"] }, version: 1 },
    ];
    const onChange = vi.fn();
    render(<SettingsPage schema={schema} values={{}} onChange={onChange} onResetToDefault={vi.fn()} />);

    fireEvent.change(screen.getByDisplayValue("light"), { target: { value: "dark" } });
    expect(onChange).toHaveBeenCalledWith("demoapp.theme", "dark");
  });
});
