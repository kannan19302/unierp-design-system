"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./form-section.module.css";

export interface LayoutSection {
  id: string;
  label: string;
  columns: number;
  fields: string[];
}

export const formLayoutBuilderVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export const formSectionVariants = formLayoutBuilderVariants;

export type FormLayoutBuilderDensity = "ultra-compact" | "compact" | "standard" | "comfortable";
export type FormSectionDensity = FormLayoutBuilderDensity;

export interface FormLayoutBuilderProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formLayoutBuilderVariants> {
  sections: LayoutSection[];
  onReorder?: (sections: LayoutSection[]) => void;
  density?: FormLayoutBuilderDensity;
  className?: string;
}

export const FormLayoutBuilder = forwardRef<HTMLDivElement, FormLayoutBuilderProps>(
  (
    {
      sections,
      density = "standard",
      className = "",
      ...restProps
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-slot="form-section"
        data-density={density}
        className={formLayoutBuilderVariants({ density, className })}
        role="region"
        aria-label="Form layout builder"
        {...restProps}
      >
        <div className={styles.header} data-slot="form-section-header">
          <h3 className={styles.title} data-slot="form-section-title">
            Form Layout Builder
          </h3>
        </div>
        <div className={styles.content} data-slot="form-section-content">
          {sections.map((s) => (
            <div key={s.id} className={styles.section} data-slot="form-section-item">
              <div className={styles.sectionTitle} data-slot="form-section-item-title">
                <span aria-hidden="true">📐 </span>
                {s.label} ({s.columns} column{s.columns > 1 ? "s" : ""})
              </div>
              <div
                className={styles.fieldsGrid}
                data-slot="form-section-grid"
                style={{
                  gridTemplateColumns: `repeat(${s.columns}, 1fr)`,
                }}
              >
                {s.fields.map((f, fi) => (
                  <div
                    key={fi}
                    className={styles.fieldSlot}
                    data-slot="form-section-field"
                  >
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

FormLayoutBuilder.displayName = "FormLayoutBuilder";

export const FormSection = FormLayoutBuilder;
export type FormSectionProps = FormLayoutBuilderProps;
