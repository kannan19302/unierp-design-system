"use client";

import React from "react";
import styles from "./form-field-visibility-engine.module.css";

export interface FormFieldVisibilityEngineProps { fields: VisibilityField[]; values: Record<string, unknown>; children?: React.ReactNode | ((visibleKeys: string[]) => React.ReactNode); }
export interface VisibilityField { key: string; visibleWhen?: { field: string; equals: unknown }; }

export const FormFieldVisibilityEngine = React.forwardRef<
  HTMLDivElement,
  FormFieldVisibilityEngineProps
>((props, ref) => {
  const { fields, values, children } = props;
  const visibleKeys = fields
    .filter((f) => {
      if (!f.visibleWhen) return true;
      return values[f.visibleWhen.field] === f.visibleWhen.equals;
    })
    .map((f) => f.key);
  return (
    <div ref={ref} className={styles.container} role="group" aria-label="Visibility engine">
      {typeof children === "function" ? children(visibleKeys) : children || <div />}
    </div>
  );
});

FormFieldVisibilityEngine.displayName = "FormFieldVisibilityEngine";
