"use client";

import { useState, useMemo, type FC } from "react";
import { Paintbrush, CheckCircle2, AlertTriangle, Copy, Check } from "lucide-react";
import { validateTenantBrandContrast } from "../branding";

import styles from "./theme-customizer.module.css";

export interface TenantThemeConfig {
  tenantId: string;
  tenantName: string;
  brandPrimary: string;
  brandAccent: string;
  radius: "none" | "sm" | "md" | "lg" | "full";
  density: "compact" | "standard" | "comfortable";
}

export interface ThemeCustomizerProps {
  initialConfig?: Partial<TenantThemeConfig>;
  onSave?: (config: TenantThemeConfig) => void;
  className?: string;
}

export const ThemeCustomizer: FC<ThemeCustomizerProps> = ({
  initialConfig,
  onSave,
  className = "",
}) => {
  const [config, setConfig] = useState<TenantThemeConfig>({
    tenantId: initialConfig?.tenantId ?? "tenant_default",
    tenantName: initialConfig?.tenantName ?? "Acme Global Enterprise",
    brandPrimary: initialConfig?.brandPrimary ?? "#0f766e",
    brandAccent: initialConfig?.brandAccent ?? "#3b82f6",
    radius: initialConfig?.radius ?? "md",
    density: initialConfig?.density ?? "standard",
  });

  const [copied, setCopied] = useState(false);

  // Contrast validation
  const lightContrast = useMemo(() => {
    return validateTenantBrandContrast(config.brandPrimary, "#ffffff");
  }, [config.brandPrimary]);

  const darkContrast = useMemo(() => {
    return validateTenantBrandContrast(config.brandPrimary, "#0f172a");
  }, [config.brandPrimary]);

  const radiusMap = {
    none: "0px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  };

  const cssTokens = useMemo(() => {
    return `/* Tenant Theme: ${config.tenantName} (${config.tenantId}) */
[data-tenant="${config.tenantId}"] {
  --color-brand: ${config.brandPrimary};
  --color-brand-accent: ${config.brandAccent};
  --radius-md: ${radiusMap[config.radius]};
  --density-control-height: ${config.density === "compact" ? "30px" : config.density === "comfortable" ? "42px" : "36px"};
}`;
  }, [config]);

  const copyTokens = () => {
    navigator.clipboard?.writeText(cssTokens);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${styles.container || ""} ${className}`}>
      <div className={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontWeight: 600 }}>
          <Paintbrush size={16} style={{ color: config.brandPrimary }} />
          <span>Tenant Theme Customizer & White-Label Studio</span>
        </div>
        <button
          type="button"
          onClick={() => onSave?.(config)}
          style={{
            padding: "6px 14px",
            background: config.brandPrimary,
            color: "#ffffff",
            border: "none",
            borderRadius: radiusMap[config.radius],
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Theme
        </button>
      </div>

      <div className={styles.body}>
        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Tenant Name</label>
            <input
              type="text"
              className={styles.hexInput}
              style={{ width: "100%" }}
              value={config.tenantName}
              onChange={(e) => setConfig({ ...config, tenantName: e.target.value })}
              aria-label="Tenant Organization Name"
            />
          </div>

          <div className={styles.fieldGroup}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
              <label className={styles.label}>Primary Brand Color</label>
              <div style={{ display: "flex", gap: 4 }}>
                <div className={`${styles.contrastBadge} ${lightContrast.valid ? styles.contrastPass : styles.contrastFail}`}>
                  {lightContrast.valid ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                  <span>Light: {lightContrast.ratio}:1</span>
                </div>
                <div className={`${styles.contrastBadge} ${darkContrast.valid ? styles.contrastPass : styles.contrastFail}`}>
                  {darkContrast.valid ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                  <span>Dark: {darkContrast.ratio}:1</span>
                </div>
              </div>
            </div>
            <div className={styles.colorInputRow}>
              <input
                type="color"
                className={styles.colorPicker}
                value={config.brandPrimary}
                onChange={(e) => setConfig({ ...config, brandPrimary: e.target.value })}
                aria-label="Pick primary brand color"
              />
              <input
                type="text"
                className={styles.hexInput}
                value={config.brandPrimary}
                onChange={(e) => setConfig({ ...config, brandPrimary: e.target.value })}
                aria-label="Hex primary brand color"
              />
            </div>
          </div>


          <div className={styles.fieldGroup}>
            <label className={styles.label}>Secondary Accent Color</label>
            <div className={styles.colorInputRow}>
              <input
                type="color"
                className={styles.colorPicker}
                value={config.brandAccent}
                onChange={(e) => setConfig({ ...config, brandAccent: e.target.value })}
                aria-label="Pick accent color"
              />
              <input
                type="text"
                className={styles.hexInput}
                value={config.brandAccent}
                onChange={(e) => setConfig({ ...config, brandAccent: e.target.value })}
                aria-label="Hex accent color"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Border Radius Scale</label>
            <select
              className={styles.hexInput}
              style={{ width: "100%" }}
              value={config.radius}
              onChange={(e) => setConfig({ ...config, radius: e.target.value as any })}
              aria-label="Border radius scale"
            >
              <option value="none">None (0px - Sharp / Modernist)</option>
              <option value="sm">Small (4px - Dense Data)</option>
              <option value="md">Medium (8px - Balanced Default)</option>
              <option value="lg">Large (12px - Soft Consumer)</option>
              <option value="full">Pill / Full</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Default Density</label>
            <select
              className={styles.hexInput}
              style={{ width: "100%" }}
              value={config.density}
              onChange={(e) => setConfig({ ...config, density: e.target.value as any })}
              aria-label="Default UI density"
            >
              <option value="compact">Compact (30px - Financial High Volume)</option>
              <option value="standard">Standard (36px - ERP Workspace)</option>
              <option value="comfortable">Comfortable (42px - Touch Friendly)</option>
            </select>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className={styles.previewPanel}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h5 style={{ margin: 0, fontSize: "var(--text-xs)", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>
              Live Component Preview
            </h5>
            <span style={{ fontSize: "var(--text-xs)", color: config.brandPrimary, fontWeight: 600 }}>
              {config.tenantName}
            </span>
          </div>

          <div
            className={styles.previewCanvas}
            style={{
              borderRadius: radiusMap[config.radius],
            }}
          >
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <button
                type="button"
                style={{
                  padding: "6px 16px",
                  background: config.brandPrimary,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: radiusMap[config.radius],
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Primary Button
              </button>
              <button
                type="button"
                style={{
                  padding: "6px 16px",
                  background: "transparent",
                  color: config.brandPrimary,
                  border: `1px solid ${config.brandPrimary}`,
                  borderRadius: radiusMap[config.radius],
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Outline Button
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${config.brandPrimary}1a`,
                  color: config.brandPrimary,
                  borderRadius: radiusMap[config.radius],
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                }}
              >
                Active Status
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  background: `${config.brandAccent}1a`,
                  color: config.brandAccent,
                  borderRadius: radiusMap[config.radius],
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                }}
              >
                Secondary Tag
              </span>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-1)" }}>
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-secondary)" }}>
                Exported CSS Variables
              </span>
              <button
                type="button"
                onClick={copyTokens}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 8px",
                  fontSize: "var(--text-xs)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-surface)",
                  cursor: "pointer",
                }}
              >
                {copied ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy CSS"}
              </button>
            </div>
            <pre className={styles.codeOutput}>{cssTokens}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
