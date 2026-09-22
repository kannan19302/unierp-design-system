import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { BpmnSimulationBar } from "./bpmn-simulation-bar";

describe("BpmnSimulationBar Component", () => {
  it("renders controls and handles play, pause, and reset triggers", () => {
    const onPlay = vi.fn();
    const onPause = vi.fn();
    const onReset = vi.fn();

    const { rerender } = render(
      <BpmnSimulationBar
        status="idle"
        onPlay={onPlay}
        onPause={onPause}
        onReset={onReset}
        totalDuration="12m"
      />
    );

    const playBtn = screen.getByRole("button", { name: "Start simulation" });
    fireEvent.click(playBtn);
    expect(onPlay).toHaveBeenCalledTimes(1);

    rerender(
      <BpmnSimulationBar
        status="running"
        onPlay={onPlay}
        onPause={onPause}
        onReset={onReset}
        totalDuration="12m"
      />
    );

    const pauseBtn = screen.getByRole("button", { name: "Pause simulation" });
    fireEvent.click(pauseBtn);
    expect(onPause).toHaveBeenCalledTimes(1);

    const resetBtn = screen.getByRole("button", { name: "Reset simulation" });
    fireEvent.click(resetBtn);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("handles speed change toggling", () => {
    const onChangeSpeed = vi.fn();
    render(
      <BpmnSimulationBar
        status="idle"
        onPlay={() => {}}
        onPause={() => {}}
        onReset={() => {}}
        speed={1}
        onChangeSpeed={onChangeSpeed}
        totalDuration="1h"
      />
    );

    const speed2x = screen.getByRole("button", { name: "2x speed" });
    fireEvent.click(speed2x);
    expect(onChangeSpeed).toHaveBeenCalledWith(2);
  });

  it("forwards ref to outer container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <BpmnSimulationBar
        ref={ref}
        status="idle"
        onPlay={() => {}}
        onPause={() => {}}
        onReset={() => {}}
        totalDuration="0s"
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <BpmnSimulationBar
        status="idle"
        onPlay={() => {}}
        onPause={() => {}}
        onReset={() => {}}
        totalDuration="4h"
        slaStatus="compliant"
        steps={[{ id: "1", name: "Step 1", duration: "10s", type: "auto" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
