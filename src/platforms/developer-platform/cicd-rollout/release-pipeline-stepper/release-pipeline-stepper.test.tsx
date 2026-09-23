import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ReleasePipelineStepper, type ReleaseStage } from "./release-pipeline-stepper";

describe("ReleasePipelineStepper Component", () => {
  const sampleStages: ReleaseStage[] = [
    { id: "dev", name: "Dev", environment: "dev.local", status: "success", version: "v1.0" },
    { id: "prod", name: "Prod", environment: "prod.live", status: "awaiting_approval", version: "v1.0" },
  ];

  it("renders stages and handles stage selection", () => {
    const onSelect = vi.fn();
    render(
      <ReleasePipelineStepper
        stages={sampleStages}
        onSelectStage={onSelect}
      />
    );

    expect(screen.getByText("Dev")).toBeInTheDocument();
    expect(screen.getByText("Prod")).toBeInTheDocument();

    const devCard = screen.getByRole("listitem", { name: /Dev stage: Passed/ });
    fireEvent.click(devCard);
    expect(onSelect).toHaveBeenCalledWith(sampleStages[0]);
  });

  it("triggers onPromoteStage when Approve Release button is clicked", () => {
    const onPromote = vi.fn();
    render(
      <ReleasePipelineStepper
        stages={sampleStages}
        onPromoteStage={onPromote}
      />
    );

    const approveBtn = screen.getByRole("button", { name: "Approve release for Prod" });
    fireEvent.click(approveBtn);
    expect(onPromote).toHaveBeenCalledWith(sampleStages[1]);
  });

  it("forwards ref to outer container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ReleasePipelineStepper ref={ref} stages={sampleStages} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ReleasePipelineStepper stages={sampleStages} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
