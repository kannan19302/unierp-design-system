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
import { Portal } from "../portal";
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

export interface ToastApi {
  toast: (opts: ToastOptions) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const VARIANT_ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
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
      if (item.duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), item.duration);
      }
      return id;
    },
    [dismiss]
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
    [push, dismiss]
  );

  useEffect(
    () => () => {
      Object.values(timers.current).forEach(clearTimeout);
    },
    []
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Portal>
        <div role="region" aria-label="Notifications" className={styles.container}>
          {toasts.map((t) => {
            const Icon = VARIANT_ICONS[t.variant];
            return (
              <div
                key={t.id}
                role="status"
                aria-live="polite"
                className={`${styles.item} ${styles[t.variant]} ${
                  t.leaving ? styles.leaving : ""
                }`}
              >
                <Icon size={16} className={styles.icon} aria-hidden="true" />
                <div className={styles.content}>
                  {t.title && <div className={styles.title}>{t.title}</div>}
                  {t.description && (
                    <div className={styles.description}>{t.description}</div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className={styles.dismissBtn}
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
};

const NOOP_TOAST: ToastApi = {
  toast: () => "",
  success: () => "",
  error: () => "",
  warning: () => "",
  info: () => "",
  dismiss: () => {},
};

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  return ctx || NOOP_TOAST;
}
