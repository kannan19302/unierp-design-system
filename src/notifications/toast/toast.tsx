"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { CheckCircle2, AlertCircle, Info, XCircle, X } from "lucide-react";
import styles from "./toast.module.css";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms; 0 = sticky
}

interface ToastItem extends Required<Pick<ToastOptions, "variant">> {
  id: string;
  title?: string;
  description?: string;
  duration: number;
  leaving?: boolean;
}

interface ToastApi {
  toast: (opts: ToastOptions) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const VARIANT_META: Record<
  ToastVariant,
  { color: string; bg: string; Icon: typeof Info }
> = {
  success: {
    color: "var(--color-success, #10b981)",
    bg: "var(--color-success-light, #ecfdf5)",
    Icon: CheckCircle2,
  },
  error: {
    color: "var(--color-danger, #ef4444)",
    bg: "var(--color-danger-light, #fef2f2)",
    Icon: XCircle,
  },
  warning: {
    color: "var(--color-warning, #f59e0b)",
    bg: "var(--color-warning-light, #fffbeb)",
    Icon: AlertCircle,
  },
  info: {
    color: "var(--color-primary, #3b82f6)",
    bg: "var(--color-primary-light, #eff6ff)",
    Icon: Info,
  },
};

/**
 * App-wide toast provider — gives every action immediate, visible feedback.
 */
export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
    );
    window.setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      200,
    );
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const push = useCallback(
    (opts: ToastOptions) => {
      const id = Math.random().toString(36).slice(2);
      const item: ToastItem = {
        id,
        title: opts.title,
        description: opts.description,
        variant: opts.variant ?? "info",
        duration: opts.duration ?? 4000,
      };
      setToasts((prev) => [...prev, item]);
      if (item.duration > 0)
        timers.current[id] = setTimeout(() => dismiss(id), item.duration);
      return id;
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      toast: push,
      success: (title, description) =>
        push({ title, description, variant: "success" }),
      error: (title, description) =>
        push({ title, description, variant: "error", duration: 6000 }),
      warning: (title, description) =>
        push({ title, description, variant: "warning" }),
      info: (title, description) =>
        push({ title, description, variant: "info" }),
      dismiss,
    }),
    [push, dismiss],
  );

  useEffect(
    () => () => {
      Object.values(timers.current).forEach(clearTimeout);
    },
    [],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        className={styles.toastRegion}
      >
        {toasts.map((t) => {
          const meta = VARIANT_META[t.variant];
          const { Icon } = meta;
          return (
            <div
              key={t.id}
              role="status"
              aria-live="polite"
              className={`${styles.toastItem} ${t.leaving ? styles.toastItemLeaving : ""}`}
              style={{ borderLeft: `3px solid ${meta.color}` }}
            >
              <Icon
                size={18}
                style={{ color: meta.color, flexShrink: 0, marginTop: 1 }}
              />
              <div className={styles.toastContent}>
                {t.title && <div className={styles.toastTitle}>{t.title}</div>}
                {t.description && (
                  <div className={styles.toastDescription}>{t.description}</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className={styles.dismissBtn}
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (ctx) return ctx;
  const noop = (_o: ToastOptions) => "";
  return {
    toast: noop,
    success: (title, description) => noop({ title, description }),
    error: (title, description) => noop({ title, description }),
    warning: (title, description) => noop({ title, description }),
    info: (title, description) => noop({ title, description }),
    dismiss: () => {},
  };
}
