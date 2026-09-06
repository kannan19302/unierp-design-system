import type { Meta, StoryObj } from "@storybook/react";
import { CurrencyRateMatrix } from "./currency-rate-matrix";
import type { ExchangeRateEntry } from "./currency-rate-matrix";

const mockRates: ExchangeRateEntry[] = [
  {
    currencyCode: "EUR",
    currencyName: "Euro",
    symbol: "€",
    flagEmoji: "🇪🇺",
    spotRate: 0.9214,
    inverseRate: 1.0853,
    change24h: 0.32,
    sourceProvider: "ECB Fixing 14:15 CET",
    effectiveTimestamp: "2026-09-05 14:15:00 UTC",
  },
  {
    currencyCode: "GBP",
    currencyName: "British Pound",
    symbol: "£",
    flagEmoji: "🇬🇧",
    spotRate: 0.7845,
    inverseRate: 1.2747,
    change24h: -0.18,
    sourceProvider: "Bank of England Benchmark",
    effectiveTimestamp: "2026-09-05 16:00:00 UTC",
  },
  {
    currencyCode: "JPY",
    currencyName: "Japanese Yen",
    symbol: "¥",
    flagEmoji: "🇯🇵",
    spotRate: 154.22,
    inverseRate: 0.006484,
    change24h: -0.85,
    sourceProvider: "Bank of Japan Fixing",
    effectiveTimestamp: "2026-09-05 09:00:00 UTC",
  },
  {
    currencyCode: "CHF",
    currencyName: "Swiss Franc",
    symbol: "CHF",
    flagEmoji: "🇨🇭",
    spotRate: 0.8912,
    inverseRate: 1.1221,
    change24h: 0.15,
    sourceProvider: "SNB Reference Rate",
    effectiveTimestamp: "2026-09-05 11:00:00 UTC",
  },
  {
    currencyCode: "CAD",
    currencyName: "Canadian Dollar",
    symbol: "CA$",
    flagEmoji: "🇨🇦",
    spotRate: 1.3655,
    inverseRate: 0.7323,
    change24h: 0.42,
    sourceProvider: "Bank of Canada Noon Rate",
    effectiveTimestamp: "2026-09-05 16:30:00 UTC",
  },
  {
    currencyCode: "AUD",
    currencyName: "Australian Dollar",
    symbol: "A$",
    flagEmoji: "🇦🇺",
    spotRate: 1.5128,
    inverseRate: 0.661,
    change24h: -0.22,
    sourceProvider: "RBA WM/Reuters",
    effectiveTimestamp: "2026-09-05 16:00:00 UTC",
  },
  {
    currencyCode: "SGD",
    currencyName: "Singapore Dollar",
    symbol: "S$",
    flagEmoji: "🇸🇬",
    spotRate: 1.3411,
    inverseRate: 0.7456,
    change24h: 0.05,
    sourceProvider: "MAS Closing Reference",
    effectiveTimestamp: "2026-09-05 17:00:00 UTC",
  },
  {
    currencyCode: "INR",
    currencyName: "Indian Rupee",
    symbol: "₹",
    flagEmoji: "🇮🇳",
    spotRate: 83.92,
    inverseRate: 0.011916,
    change24h: -0.04,
    sourceProvider: "RBI Reference Rate 13:30 IST",
    effectiveTimestamp: "2026-09-05 08:00:00 UTC",
  },
];

const meta: Meta<typeof CurrencyRateMatrix> = {
  title: "DataDisplay/CurrencyRateMatrix",
  component: CurrencyRateMatrix,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CurrencyRateMatrix>;

export const DefaultBaseUSD: Story = {
  args: {
    baseCurrency: "USD",
    rates: mockRates,
    density: "compact",
    onRefreshRates: () => {},
  },
};

export const UltraCompactDesk: Story = {
  args: {
    baseCurrency: "USD",
    rates: mockRates,
    density: "ultra-compact",
    onRefreshRates: () => {},
  },
};

export const ComfortablePresentation: Story = {
  args: {
    baseCurrency: "EUR",
    rates: mockRates,
    density: "comfortable",
    onRefreshRates: () => {},
  },
};
