"use client";

import {
  useState,
  useCallback,
  useRef,
  useId,
  forwardRef,
  type FormEvent,
  type ReactNode,
} from "react";
import { AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "../../primitives/button";
import { Input, Textarea, Select } from "../../inputs/form-control";
import {
  Switch,
  Checkbox,
  NumberInput,
  CurrencyInput,
  PercentInput,
  TagInput,
  MultiSelect,
} from "../../inputs";
import { DatePicker } from "../../inputs/date-picker";
import { ComboBox } from "../../inputs/combobox";
import { cva, type VariantProps } from "../../foundation/utils/cva";

import styles from "./schema-form.module.css";

export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "currency"
  | "percent"
  | "textarea"
  | "select"
  | "multiselect"
  | "combobox"
  | "date"
  | "switch"
  | "checkbox"
  | "tags";

export interface SchemaSelectOption {
  label: string;
  value: string;
}

export interface FormFieldSchema {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  options?: SchemaSelectOption[];
  validate?: (value: any, formValues: Record<string, any>) => string | null | undefined;
  showIf?: (formValues: Record<string, any>) => boolean;
}

export interface FormSectionSchema {
  id: string;
  title: string;
  description?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  fields: FormFieldSchema[];
}

export const schemaFormVariants = cva(styles.form_container, {
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

export type SchemaFormDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface SchemaFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">,
    VariantProps<typeof schemaFormVariants> {
  sections: FormSectionSchema[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  onReset?: () => void;
  submitLabel?: string;
  resetLabel?: string;
  loading?: boolean;
  headerActions?: ReactNode;
  footerActions?: ReactNode;
  showErrorSummary?: boolean;
  density?: SchemaFormDensity;
  className?: string;
}

/**
 * `<SchemaForm>` — Enterprise Schema-Driven Form Engine.
 *
 * Capabilities:
 * - 14 dynamic input types (`text`, `number`, `currency`, `percent`, `date`, `combobox`, `tags`, etc.)
 * - 12-column responsive grid layout with `colSpan` per field
 * - Dynamic conditional field visibility (`showIf`)
 * - Section grouping with collapsible panels
 * - Synchronous / asynchronous validation with inline errors & error summary banner
 * - Auto-scroll to first invalid input on submission error
 * - Dirty-state tracking
 */
export const SchemaForm = forwardRef<HTMLFormElement, SchemaFormProps>(
  (
    {
      sections,
      initialValues = {},
      onSubmit,
      onReset,
      submitLabel = "Save Changes",
      resetLabel = "Reset",
      loading = false,
      headerActions,
      footerActions,
      showErrorSummary = true,
      density = "standard",
      className = "",
      ...restProps
    },
    ref
  ) => {
    const instanceId = useId();
    const fieldId = (name: string) => `${instanceId}-field-${name}`;
    // Extract initial values from field schemas
    const defaultVals = sections.flatMap((s) => s.fields).reduce((acc, f) => {
      acc[f.name] = initialValues[f.name] ?? f.defaultValue ?? "";
      return acc;
    }, {} as Record<string, any>);

    const [values, setValues] = useState<Record<string, any>>(defaultVals);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => {
      const s = new Set<string>();
      for (const sec of sections) {
        if (sec.collapsible && sec.defaultCollapsed) s.add(sec.id);
      }
      return s;
    });

    const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

    const focusField = (name: string) => {
      const element = document.getElementById(fieldId(name)) ?? fieldRefs.current[name];
      element?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      element?.focus();
    };

    const revealAndFocusField = (name: string) => {
      const owningSection = sections.find((section) => section.fields.some((field) => field.name === name));
      if (owningSection && collapsedSections.has(owningSection.id)) {
        setCollapsedSections((previous) => {
          const next = new Set(previous);
          next.delete(owningSection.id);
          return next;
        });
        window.setTimeout(() => focusField(name), 0);
      } else {
        focusField(name);
      }
    };

    const toggleSection = (id: string) => {
      setCollapsedSections((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    };

    const handleFieldChange = useCallback((name: string, val: any) => {
      setValues((prev) => {
        const next = { ...prev, [name]: val };
        return next;
      });
      // Clear error on change
      setErrors((prev) => {
        if (!prev[name]) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }, []);

    const validateAll = (): Record<string, string> => {
      const newErrors: Record<string, string> = {};

      for (const section of sections) {
        for (const field of section.fields) {
          if (field.showIf && !field.showIf(values)) continue;

          const val = values[field.name];
          if (field.required && (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0))) {
            newErrors[field.name] = `${field.label} is required`;
            continue;
          }

          if (field.validate) {
            const customErr = field.validate(val, values);
            if (customErr) {
              newErrors[field.name] = customErr;
            }
          }
        }
      }

      return newErrors;
    };

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      const validationErrors = validateAll();
      setErrors(validationErrors);

      const errorKeys = Object.keys(validationErrors);
      if (errorKeys.length > 0) {
        // Auto-scroll to first invalid element
        const firstKey = errorKeys[0];
        if (firstKey) revealAndFocusField(firstKey);
        return;
      }

      await onSubmit(values);
    };

    const handleReset = () => {
      setValues(defaultVals);
      setErrors({});
      onReset?.();
    };

    const errorEntries = Object.entries(errors);

    return (
      <form
        ref={ref}
        data-slot="schema-form"
        data-density={density}
        className={schemaFormVariants({ density, className })}
        onSubmit={handleSubmit}
        noValidate
        {...restProps}
      >
        {headerActions && <div data-slot="schema-form-header-actions">{headerActions}</div>}

        {showErrorSummary && errorEntries.length > 0 && (
          <div className={styles.error_summary} data-slot="schema-form-error-summary" role="alert" aria-label="Form validation errors">
            <div className={styles.error_summary_title} data-slot="schema-form-error-summary-title">
              <AlertCircle size={18} />
              <span>Please correct the {errorEntries.length} error(s) before proceeding:</span>
            </div>
            <ul className={styles.error_summary_list} data-slot="schema-form-error-summary-list">
              {errorEntries.map(([name, err]) => (
                <li key={name} className={styles.error_summary_item} data-slot="schema-form-error-summary-item">
                  <button type="button" className={styles.error_summary_button} onClick={() => revealAndFocusField(name)}>
                    {err}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {sections.map((section) => {
          const isCollapsed = collapsedSections.has(section.id);
          const visibleFields = section.fields.filter((f) => !f.showIf || f.showIf(values));

          return (
            <section
              key={section.id}
              className={styles.section}
              data-slot="schema-form-section"
              aria-labelledby={`${instanceId}-sec-title-${section.id}`}
            >
              <div className={styles.section_header} data-slot="schema-form-section-header">
                <div className={styles.section_title_wrap}>
                  <h3 id={`${instanceId}-sec-title-${section.id}`} className={styles.section_title} data-slot="schema-form-section-title">
                    {section.collapsible ? (
                      <button
                        type="button"
                        className={styles.section_toggle}
                        data-slot="schema-form-section-toggle"
                        aria-expanded={!isCollapsed}
                        aria-controls={`${instanceId}-sec-content-${section.id}`}
                        onClick={() => toggleSection(section.id)}
                      >
                        {section.title}
                        {isCollapsed ? <ChevronRight size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
                      </button>
                    ) : (
                      section.title
                    )}
                  </h3>
                  {section.description && (
                    <p className={styles.section_description} data-slot="schema-form-section-description">
                      {section.description}
                    </p>
                  )}
                </div>
              </div>

              <div
                id={`${instanceId}-sec-content-${section.id}`}
                className={styles.grid}
                data-slot="schema-form-grid"
                hidden={isCollapsed}
              >
                {visibleFields.map((field) => {
                  const val = values[field.name];
                  const err = errors[field.name];
                  const colClass = (styles as Record<string, string>)[`col_${field.colSpan || 12}`] || styles.col_12;

                  return (
                    <div key={field.name} className={`${styles.field_wrap} ${colClass}`} data-slot="schema-form-field">
                      {field.type !== "switch" && field.type !== "checkbox" && (
                        <label htmlFor={fieldId(field.name)} className={styles.field_label} data-slot="schema-form-label">
                          <span>{field.label}</span>
                          {field.required && <span className={styles.field_required}>*</span>}
                        </label>
                      )}

                      {renderFieldInput(field, fieldId(field.name), val, (v) => handleFieldChange(field.name, v), err, fieldRefs)}

                      {field.hint && !err && <span className={styles.field_hint} data-slot="schema-form-hint">{field.hint}</span>}
                      {err && <span className={styles.field_error} data-slot="schema-form-field-error">{err}</span>}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className={styles.actions_bar} data-slot="schema-form-actions">
          {onReset && (
            <Button
              variant="secondary"
              onClick={handleReset}
              type="button"
              disabled={loading}
              data-slot="schema-form-reset"
            >
              {resetLabel}
            </Button>
          )}
          <Button
            variant="primary"
            type="submit"
            isLoading={loading}
            data-slot="schema-form-submit"
          >
            {submitLabel}
          </Button>
          {footerActions}
        </div>
      </form>
    );
  }
);

SchemaForm.displayName = "SchemaForm";

function renderFieldInput(
  field: FormFieldSchema,
  id: string,
  value: any,
  onChange: (v: any) => void,
  error: string | undefined,
  fieldRefs: React.MutableRefObject<Record<string, HTMLElement | null>>,
) {
  switch (field.type) {
    case "text":
    case "email":
    case "password":
      return (
        <Input
          id={id}
          type={field.type}
          placeholder={field.placeholder}
          value={value ?? ""}
          onChange={(e: any) => onChange(e.target.value)}
          disabled={field.disabled}
          aria-invalid={!!error}
          ref={(el: any) => { fieldRefs.current[field.name] = el; }}
        />
      );

    case "textarea":
      return (
        <Textarea
          id={id}
          placeholder={field.placeholder}
          value={value ?? ""}
          onChange={(e: any) => onChange(e.target.value)}
          disabled={field.disabled}
          aria-invalid={!!error}
          ref={(el: any) => { fieldRefs.current[field.name] = el; }}
        />
      );

    case "number":
      return (
        <NumberInput
          id={id}
          aria-label={field.label}
          placeholder={field.placeholder}
          value={typeof value === "number" ? value : 0}
          onChange={onChange}
          disabled={field.disabled}
          ref={(el: any) => { fieldRefs.current[field.name] = el; }}
        />
      );

    case "currency":
      return (
        <CurrencyInput
          id={id}
          aria-label={field.label}
          placeholder={field.placeholder}
          value={typeof value === "number" ? value : 0}
          onChange={onChange}
          disabled={field.disabled}
          ref={(el: any) => { fieldRefs.current[field.name] = el; }}
        />
      );

    case "percent":
      return (
        <PercentInput
          id={id}
          aria-label={field.label}
          value={typeof value === "number" ? value : 0}
          onChange={onChange}
          disabled={field.disabled}
          ref={(el: any) => { fieldRefs.current[field.name] = el; }}
        />
      );

    case "select":
      return (
        <Select
          id={id}
          value={value ?? ""}
          onChange={(e: any) => onChange(e.target.value)}
          disabled={field.disabled}
          aria-invalid={!!error}
          ref={(el: any) => { fieldRefs.current[field.name] = el; }}
        >
          {field.placeholder && <option value="">{field.placeholder}</option>}
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      );

    case "switch":
      return (
        <Switch
          id={id}
          checked={!!value}
          onChange={onChange}
          disabled={field.disabled}
          label={field.label}
          ref={(el: any) => { fieldRefs.current[field.name] = el; }}
        />
      );

    case "checkbox":
      return (
        <Checkbox
          id={id}
          checked={!!value}
          onChange={onChange}
          disabled={field.disabled}
          label={field.label}
          ref={(el: any) => { fieldRefs.current[field.name] = el; }}
        />
      );

    case "tags":
      return (
        <TagInput
          id={id}
          tags={Array.isArray(value) ? value : []}
          onChange={onChange}
          placeholder={field.placeholder}
          ref={(el: any) => { fieldRefs.current[field.name] = el; }}
        />
      );

    case "multiselect":
      return (
        <MultiSelect
          id={id}
          aria-label={field.label}
          options={field.options ?? []}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          placeholder={field.placeholder}
          ref={(el: any) => { fieldRefs.current[field.name] = el; }}
        />
      );

    case "date":
      return (
        <DatePicker
          id={id}
          aria-label={field.label}
          value={typeof value === "string" ? value : value instanceof Date ? value.toISOString().split("T")[0] : ""}
          onChange={(d: any) => onChange(d ? (typeof d === "string" ? d : d.toISOString().split("T")[0]) : "")}
          disabled={field.disabled}
          placeholder={field.placeholder}
          ref={(el: any) => { fieldRefs.current[field.name] = el; }}
        />
      );

    case "combobox":
      return (
        <ComboBox
          id={id}
          aria-label={field.label}
          options={field.options?.map((o) => ({ value: o.value, label: o.label })) ?? []}
          value={value ?? ""}
          onChange={onChange}
          placeholder={field.placeholder}
          disabled={field.disabled}
          ref={(el: any) => { fieldRefs.current[field.name] = el; }}
        />
      );

    default:
      return (
        <Input
          id={id}
          value={value ?? ""}
          onChange={(e: any) => onChange(e.target.value)}
          disabled={field.disabled}
          ref={(el: any) => { fieldRefs.current[field.name] = el; }}
        />
      );
  }
}
