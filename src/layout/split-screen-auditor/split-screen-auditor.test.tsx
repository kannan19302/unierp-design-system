import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { SplitScreenAuditor } from "./split-screen-auditor";

describe("SplitScreenAuditor Component", () => {
  it("renders document viewer pane and audit form pane", () => {
    render(
      <SplitScreenAuditor
        documentTitle="Invoice PDF"
        formTitle="Reconciliation Form"
        documentViewer={<div>Scanned Document Stream</div>}
        auditForm={<div>Form Field Entries</div>}
      />
    );

    expect(screen.getByText("Invoice PDF")).toBeInTheDocument();
    expect(screen.getByText("Reconciliation Form")).toBeInTheDocument();
    expect(screen.getByText("Scanned Document Stream")).toBeInTheDocument();
    expect(screen.getByText("Form Field Entries")).toBeInTheDocument();
  });

  it("handles keyboard splitter resize with Arrow keys", () => {
    const onSplitChange = vi.fn();
    render(
      <SplitScreenAuditor
        defaultSplitRatio={50}
        onSplitChange={onSplitChange}
        documentViewer={<div>Doc</div>}
        auditForm={<div>Form</div>}
      />
    );

    const splitter = screen.getByRole("separator");
    expect(splitter).toHaveAttribute("aria-valuenow", "50");

    fireEvent.keyDown(splitter, { key: "ArrowLeft" });
    expect(onSplitChange).toHaveBeenCalledWith(48);

    fireEvent.keyDown(splitter, { key: "ArrowRight" });
    expect(onSplitChange).toHaveBeenCalledWith(50);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SplitScreenAuditor
        documentViewer={<div>Accessible Document Canvas</div>}
        auditForm={<div>Accessible Form Fields</div>}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
