import { cn, type ClassValue } from "./cn";

export type VariantValues = Record<string, ClassValue>;
export type VariantSchema = Record<string, VariantValues>;

export type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;

export type ConfigVariants<T extends VariantSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null | undefined;
};

export type VariantProps<T extends (...args: any) => any> =
  T extends (props?: infer P) => any
    ? P extends undefined
      ? Record<string, never>
      : {
          [K in keyof Omit<P, "class" | "className">]?: P[K];
        }
    : Record<string, never>;

export interface Config<T extends VariantSchema> {
  variants?: T;
  defaultVariants?: ConfigVariants<T>;
  compoundVariants?: Array<
    ConfigVariants<T> & {
      class?: ClassValue;
      className?: ClassValue;
    }
  >;
}

export type CvaFunction<T extends VariantSchema> = (
  props?: ConfigVariants<T> & {
    class?: ClassValue;
    className?: ClassValue;
  },
) => string;

/**
 * Class Variance Authority (`cva`) — builds type-safe variant class generators.
 * Compatible with shadcn/ui community standards and CSS Modules.
 */
export function cva<T extends VariantSchema = Record<never, never>>(
  base?: ClassValue,
  config?: Config<T>,
): CvaFunction<T> {
  return (props) => {
    if (!config?.variants) {
      return cn(base, props?.class, props?.className);
    }

    const { variants, defaultVariants, compoundVariants } = config;
    const variantClasses: ClassValue[] = [];

    // Resolve variant classes
    for (const variantKey in variants) {
      const variantValue =
        props?.[variantKey] !== undefined && props?.[variantKey] !== null
          ? (props[variantKey] as string | boolean)
          : defaultVariants?.[variantKey];

      if (variantValue !== undefined && variantValue !== null) {
        const strVal = String(variantValue);
        const resolvedClass = variants[variantKey]?.[strVal];
        if (resolvedClass) {
          variantClasses.push(resolvedClass);
        }
      }
    }

    // Resolve compound variants
    if (compoundVariants) {
      for (const cv of compoundVariants) {
        const { class: cvClass, className: cvClassName, ...cvConditions } = cv;
        const matches = Object.entries(cvConditions).every(([key, expectedVal]) => {
          const actualVal =
            props?.[key] !== undefined && props?.[key] !== null
              ? props[key]
              : defaultVariants?.[key];
          return String(actualVal) === String(expectedVal);
        });

        if (matches) {
          if (cvClass) variantClasses.push(cvClass);
          if (cvClassName) variantClasses.push(cvClassName);
        }
      }
    }

    return cn(base, variantClasses, props?.class, props?.className);
  };
}
