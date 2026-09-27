/**
 * ClassValue represents any valid class input: strings, numbers, booleans, objects, arrays.
 */
export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | { [key: string]: any }
  | ClassValue[];

function toVal(mix: ClassValue): string {
  let str = "";
  if (typeof mix === "string" || typeof mix === "number") {
    str += mix;
  } else if (typeof mix === "object" && mix !== null) {
    if (Array.isArray(mix)) {
      for (let k = 0; k < mix.length; k++) {
        if (mix[k]) {
          const y = toVal(mix[k]);
          if (y) {
            if (str) str += " ";
            str += y;
          }
        }
      }
    } else {
      for (const k in mix) {
        if (mix[k]) {
          if (str) str += " ";
          str += k;
        }
      }
    }
  }
  return str;
}

/** Joins truthy class names — the canonical class combiner for UniERP UI (supports strings, arrays, objects). */
export function cn(...inputs: ClassValue[]): string {
  let out = "";
  for (let i = 0; i < inputs.length; i++) {
    const val = inputs[i];
    if (val) {
      const x = toVal(val);
      if (x) {
        if (out) out += " ";
        out += x;
      }
    }
  }
  return out;
}
