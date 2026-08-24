import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TrialCountdown } from "../trial-countdown";

describe("TrialCountdown", () => {
  afterEach(() => vi.useRealTimers());

  it("updates at seconds precision without an aria-live announcement storm", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-24T10:00:00Z"));
    const { container } = render(
      <TrialCountdown endsAt="2026-08-25T10:00:02Z" />,
    );

    expect(screen.getByText("1d 00h 00m 02s")).toBeInTheDocument();
    expect(container.querySelector("[aria-live]")).toBeNull();
    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.getByText("1d 00h 00m 01s")).toBeInTheDocument();
  });

  it("renders the terminal state and calls onExpired", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-24T10:00:00Z"));
    const onExpired = vi.fn();
    render(
      <TrialCountdown endsAt="2026-08-24T10:00:01Z" onExpired={onExpired} />,
    );

    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.getByText("Your Free Trial has ended.")).toBeInTheDocument();
    expect(onExpired).toHaveBeenCalledTimes(1);
  });
});
