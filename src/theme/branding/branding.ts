/**
 * WCAG AA Contrast Validation for Tenant White-Label Branding (B22)
 * Ensures tenant-supplied brand tokens satisfy WCAG AA contrast ratios (4.5:1 for text).
 */

function hexToRgb(hex: string): [number, number, number] | null {
  const cleanHex = hex.replace(/^#/, "");
  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex.split("").map((c: any) => c + c).join("");
  }
  if (fullHex.length !== 6) return null;
  const num = parseInt(fullHex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c: any) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * (rs ?? 0) + 0.7152 * (gs ?? 0) + 0.0722 * (bs ?? 0);
}

export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return 1;

  const l1 = getLuminance(...rgb1);
  const l2 = getLuminance(...rgb2);
  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (brighter + 0.05) / (darker + 0.05);
}

export interface ContrastValidationResult {
  valid: boolean;
  ratio: number;
  failingPair?: string;
  error?: string;
}

export function validateTenantBrandContrast(
  primaryColor: string,
  backgroundColor: string = "#ffffff"
): ContrastValidationResult {
  const ratio = getContrastRatio(primaryColor, backgroundColor);
  if (ratio < 4.5) {
    const failingPair = `Primary (${primaryColor}) vs Background (${backgroundColor})`;
    return {
      valid: false,
      ratio: Number(ratio.toFixed(2)),
      failingPair,
      error: `WCAG AA contrast failure: ${failingPair} ratio is ${ratio.toFixed(2)}:1 (minimum 4.5:1 required).`,
    };
  }
  return {
    valid: true,
    ratio: Number(ratio.toFixed(2)),
  };
}
