import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { BpmnPalette } from "./bpmn-palette";

describe("BpmnPalette Component", () => {
  it("renders BPMN elements and filters with search input", () => {
    render(<BpmnPalette />);

    expect(screen.getByText("Start Event")).toBeInTheDocument();
    expect(screen.getByText("User Task")).toBeInTheDocument();

    const searchInput = screen.getByLabelText("Filter BPMN elements");
    fireEvent.change(searchInput, { target: { value: "timer" } });

    expect(screen.getByText("Timer Event")).toBeInTheDocument();
    expect(screen.queryByText("User Task")).not.toBeInTheDocument();
  });

  it("handles node selection via click and enter key", () => {
    const onSelect = vi.fn();
    render(<BpmnPalette onSelectNode={onSelect} />);

    const startEvent = screen.getByText("Start Event").closest('[role="listitem"]')!;
    fireEvent.click(startEvent);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "bpmn-start-event" }));

    fireEvent.keyDown(startEvent, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it("handles drag start with dataTransfer", () => {
    const onDragStart = vi.fn();
    render(<BpmnPalette onDragStartNode={onDragStart} />);

    const setData = vi.fn();
    const startEvent = screen.getByText("Start Event").closest('[role="listitem"]')!;
    fireEvent.dragStart(startEvent, { dataTransfer: { setData } });

    expect(setData).toHaveBeenCalledWith("application/bpmn-type", "bpmn-start-event");
    expect(onDragStart).toHaveBeenCalled();
  });

  it("forwards ref to outer container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<BpmnPalette ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<BpmnPalette />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
