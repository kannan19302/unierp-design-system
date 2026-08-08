/**
 * Utility to warn in development when a component prop is deprecated.
 * B16: Deprecated props warn in development with the replacement named.
 */
export function useDeprecatedProp(
  componentName: string,
  deprecatedPropName: string,
  value: unknown,
  replacementPropName: string
): void {
  if (process.env.NODE_ENV !== "production" && value !== undefined) {
    console.warn(
      `[Deprecation Warning] <${componentName} ${deprecatedPropName}={...}> is deprecated and will be removed in the next major release. Please use <${componentName} ${replacementPropName}={...}> instead.`
    );
  }
}
