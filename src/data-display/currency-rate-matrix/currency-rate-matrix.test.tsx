import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { CurrencyRateMatrix } from "./currency-rate-matrix";
import type { ExchangeRateEntry } from "./currency-rate-matrix";

const mockRates: ExchangeRateEntry[] = [
  {
    currencyCode: "EUR",
    currencyName: "Euro",
    symbol: "€",
    spotRate: 0.92,
    inverseRate: 1.087,
    change24h: 0.35,
    sourceProvider: "ECB Fixing",
    effectiveTimestamp: "2026-09-05 14:15 UTC",
  },
  {
    currencyCode: "GBP",
    currencyName: "British Pound",
    symbol: "£",
    spotRate: 0.78,
    inverseRate: 1.282,
    change24h: -0.2,
    sourceProvider: "BOE Fixing",
    effectiveTimestamp: "2026-09-05 16:00 UTC",
  },
];

describe("CurrencyRateMatrix", () => {
  it("renders base currency and foreign exchange rates", () => {
    render(<CurrencyRateMatrix rates={mockRates} baseCurrency="USD" />);

    expect(screen.getByText("Base Currency:")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByText("EUR")).toBeInTheDocument();
    expect(screen.getByText("Euro")).toBeInTheDocument();
    expect(screen.getByText("GBP")).toBeInTheDocument();
  });

  it("filters currency list when query is typed", () => {
    render(<CurrencyRateMatrix rates={mockRates} />);

    const searchInput = screen.getByLabelText(/Filter currency rates/i);
    fireEvent.change(searchInput, { target: { value: "Euro" } });

    expect(screen.getByText("EUR")).toBeInTheDocument();
    expect(screen.queryByText("GBP")).not.toBeInTheDocument();
  });

  it("toggles quick calculator and updates converted amount", () => {
    render(<CurrencyRateMatrix rates={mockRates} baseCurrency="USD" />);

    const toggleCalcBtn = screen.getByRole("button", { name: /FX Calculator/i });
    fireEvent.click(toggleCalcBtn);

    const amountInput = screen.getByLabelText(/Amount in USD/i);
    expect(amountInput).toBeInTheDocument();

    fireEvent.change(amountInput, { target: { value: "2000" } });
    expect(screen.getByText(/1,840/)).toBeInTheDocument(); // 2000 * 0.92 = 1840
  });

  it("triggers onRefreshRates when refresh button is clicked", () => {
    const onRefreshRates = vi.fn();
    render(<CurrencyRateMatrix rates={mockRates} onRefreshRates={onRefreshRates} />);

    fireEvent.click(screen.getByRole("button", { name: /Refresh Rate Fixings/i }));
    expect(onRefreshRates).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<CurrencyRateMatrix rates={mockRates} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
