"use client";

import {
  useState,
  useMemo,
  useRef,
  type FC,
  type ChangeEvent,
} from "react";
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Trash2,
  Lock,
  FileText,
  AlertCircle,
} from "lucide-react";
import styles from "./secret-environment-editor.module.css";

export type EnvironmentScope = "production" | "staging" | "development" | "all";
export type SecretDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface SecretItem {
  id: string;
  key: string;
  value: string;
  scope: EnvironmentScope;
  comment?: string;
  updatedAt?: string;
}

export interface SecretEnvironmentEditorProps {
  /** Initial secrets array */
  initialSecrets?: SecretItem[];
  /** Callback when secrets change */
  onChange?: (secrets: SecretItem[]) => void;
  /** Active environment filter */
  defaultScope?: EnvironmentScope;
  /** Title or scope caption */
  title?: string;
  /** Density scale */
  density?: SecretDensity;
  className?: string;
}

/**
 * `<SecretEnvironmentEditor>` — Secure key-value credential & environment variable table.
 * Benchmarked against Vercel (#85), AWS Secrets Manager / IAM (#81), and Tailscale (#95).
 */
export const SecretEnvironmentEditor: FC<SecretEnvironmentEditorProps> = ({
  initialSecrets = [],
  onChange,
  defaultScope = "all",
  title = "Environment Variables & Secrets",
  density = "compact",
  className = "",
}) => {
  const [secrets, setSecrets] = useState<SecretItem[]>(initialSecrets);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [scopeFilter, setScopeFilter] = useState<EnvironmentScope>(defaultScope);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newScope, setNewScope] = useState<EnvironmentScope>("production");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [rawImportText, setRawImportText] = useState("");
  const autoHideTimers = useRef<Record<string, NodeJS.Timeout>>({});

  const filteredSecrets = useMemo(() => {
    if (scopeFilter === "all") return secrets;
    return secrets.filter((s) => s.scope === scopeFilter || s.scope === "all");
  }, [secrets, scopeFilter]);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        if (autoHideTimers.current[id]) {
          clearTimeout(autoHideTimers.current[id]);
          delete autoHideTimers.current[id];
        }
      } else {
        next.add(id);
        // Auto-hide after 30 seconds for security
        autoHideTimers.current[id] = setTimeout(() => {
          setRevealedIds((current) => {
            const copy = new Set(current);
            copy.delete(id);
            return copy;
          });
          delete autoHideTimers.current[id];
        }, 30000);
      }
      return next;
    });
  };

  const handleCopy = (id: string, val: string) => {
    navigator.clipboard?.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSecret = () => {
    const trimmedKey = newKey.trim().toUpperCase();
    if (!trimmedKey) {
      setErrorMessage("Variable key is required.");
      return;
    }
    if (!/^[A-Z_][A-Z0-9_]*$/.test(trimmedKey)) {
      setErrorMessage("Key must be uppercase letters, numbers, and underscores.");
      return;
    }
    if (secrets.some((s) => s.key === trimmedKey && (s.scope === newScope || s.scope === "all"))) {
      setErrorMessage(`Variable '${trimmedKey}' already exists for scope '${newScope}'.`);
      return;
    }

    const newItem: SecretItem = {
      id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      key: trimmedKey,
      value: newValue,
      scope: newScope,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    const updated = [...secrets, newItem];
    setSecrets(updated);
    onChange?.(updated);
    setNewKey("");
    setNewValue("");
    setErrorMessage(null);
  };

  const handleDeleteSecret = (id: string) => {
    const updated = secrets.filter((s) => s.id !== id);
    setSecrets(updated);
    onChange?.(updated);
  };

  const handleImportEnv = () => {
    if (!rawImportText.trim()) return;
    const lines = rawImportText.split("\n");
    const parsed: SecretItem[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;

      const key = trimmed.slice(0, eqIdx).trim().toUpperCase();
      let value = trimmed.slice(eqIdx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      parsed.push({
        id: `sec-imp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        key,
        value,
        scope: scopeFilter === "all" ? "production" : scopeFilter,
        updatedAt: new Date().toISOString().split("T")[0],
      });
    }

    const updated = [...secrets, ...parsed];
    setSecrets(updated);
    onChange?.(updated);
    setShowImportModal(false);
    setRawImportText("");
  };

  return (
    <div
      className={`${styles.container} ${className}`.trim()}
      data-density={density}
      role="region"
      aria-label="Secret Environment Editor"
    >
      {/* ── Toolbar Header ── */}
      <div className={styles.toolbar}>
        <div className={styles.titleGroup}>
          <Lock size={15} className={styles.lockIcon} aria-hidden="true" />
          <h3 className={styles.title}>{title}</h3>
          <span className={styles.countBadge}>{filteredSecrets.length} items</span>
        </div>

        <div className={styles.toolbarActions}>
          <div className={styles.scopeFilterGroup}>
            {(["all", "production", "staging", "development"] as EnvironmentScope[]).map((scope) => (
              <button
                key={scope}
                type="button"
                className={`${styles.scopeTab} ${scopeFilter === scope ? styles.scopeTabActive : ""}`}
                onClick={() => setScopeFilter(scope)}
                aria-pressed={scopeFilter === scope}
              >
                {scope}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => setShowImportModal(true)}
            title="Import .env contents"
          >
            <FileText size={13} aria-hidden="true" />
            <span>.env Import</span>
          </button>
        </div>
      </div>

      {/* ── Import Drawer / Modal Overlay ── */}
      {showImportModal && (
        <div className={styles.importBox}>
          <label htmlFor="raw-env-textarea" className={styles.importLabel}>
            Paste .env or key=value declarations:
          </label>
          <textarea
            id="raw-env-textarea"
            className={styles.importTextarea}
            rows={4}
            placeholder={"DATABASE_URL=postgres://...\nAPI_SECRET_KEY=sk_live_..."}
            value={rawImportText}
            onChange={(e) => setRawImportText(e.target.value)}
          />
          <div className={styles.importActions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => setShowImportModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={handleImportEnv}
              disabled={!rawImportText.trim()}
            >
              Parse & Append
            </button>
          </div>
        </div>
      )}

      {/* ── Error Banner ── */}
      {errorMessage && (
        <div className={styles.errorAlert} role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          <span>{errorMessage}</span>
          <button
            type="button"
            className={styles.dismissError}
            onClick={() => setErrorMessage(null)}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* ── Add Inline Row Bar ── */}
      <div className={styles.addBar}>
        <input
          type="text"
          className={styles.inputKey}
          placeholder="VARIABLE_NAME"
          value={newKey}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewKey(e.target.value.toUpperCase())}
          aria-label="New Variable Key"
        />
        <input
          type="password"
          className={styles.inputValue}
          placeholder="Secret value..."
          value={newValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewValue(e.target.value)}
          aria-label="New Variable Secret Value"
        />
        <select
          className={styles.scopeSelect}
          value={newScope}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewScope(e.target.value as EnvironmentScope)}
          aria-label="Target Environment Scope"
        >
          <option value="production">Production</option>
          <option value="staging">Staging</option>
          <option value="development">Development</option>
          <option value="all">All Environments</option>
        </select>
        <button
          type="button"
          className={styles.btnAdd}
          onClick={handleAddSecret}
          disabled={!newKey.trim()}
          aria-label="Add Environment Secret"
        >
          <Plus size={14} aria-hidden="true" />
          <span>Add</span>
        </button>
      </div>

      {/* ── High-Density Data Table ── */}
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Key</th>
              <th scope="col">Environment</th>
              <th scope="col">Value</th>
              <th scope="col" className={styles.actionCol}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSecrets.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.emptyCell}>
                  No environment secrets defined for current scope.
                </td>
              </tr>
            ) : (
              filteredSecrets.map((secret) => {
                const isRevealed = revealedIds.has(secret.id);
                const isCopied = copiedId === secret.id;

                return (
                  <tr key={secret.id} className={styles.row}>
                    <td className={styles.keyCell}>
                      <code className={styles.keyCode}>{secret.key}</code>
                    </td>
                    <td className={styles.scopeCell}>
                      <span className={`${styles.scopeBadge} ${styles[`scope_${secret.scope}`]}`}>
                        {secret.scope}
                      </span>
                    </td>
                    <td className={styles.valueCell}>
                      {isRevealed ? (
                        <code className={styles.valueRevealed}>{secret.value}</code>
                      ) : (
                        <span className={styles.valueMasked}>••••••••••••••••</span>
                      )}
                    </td>
                    <td className={styles.actionCol}>
                      <div className={styles.actionBtnGroup}>
                        <button
                          type="button"
                          className={styles.iconActionBtn}
                          onClick={() => toggleReveal(secret.id)}
                          title={isRevealed ? "Hide value" : "Reveal value"}
                          aria-label={isRevealed ? `Hide ${secret.key}` : `Reveal ${secret.key}`}
                        >
                          {isRevealed ? <EyeOff size={13} aria-hidden="true" /> : <Eye size={13} aria-hidden="true" />}
                        </button>

                        <button
                          type="button"
                          className={styles.iconActionBtn}
                          onClick={() => handleCopy(secret.id, secret.value)}
                          title="Copy to clipboard"
                          aria-label={`Copy value for ${secret.key}`}
                        >
                          {isCopied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                        </button>

                        <button
                          type="button"
                          className={`${styles.iconActionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDeleteSecret(secret.id)}
                          title="Delete secret"
                          aria-label={`Delete ${secret.key}`}
                        >
                          <Trash2 size={13} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
