import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { axe } from "vitest-axe";
import { DocumentAnnotator } from "./document-annotator";

describe("DocumentAnnotator Primitive", () => {
  it("forwards ref to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DocumentAnnotator ref={ref} title="Test Document">
        <div>Doc</div>
      </DocumentAnnotator>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders document title and stamp actions", () => {
    const onAddStamp = vi.fn();
    render(
      <DocumentAnnotator
        title="Commercial Invoice"
        documentNumber="INV-100"
        onAddStamp={onAddStamp}
      >
        <div>Invoice Body</div>
      </DocumentAnnotator>
    );

    expect(screen.getByText("Commercial Invoice")).toBeInTheDocument();
    expect(screen.getByText(/INV-100/)).toBeInTheDocument();
    expect(screen.getByText("Invoice Body")).toBeInTheDocument();

    const approveBtn = screen.getByText("+ Approve Stamp");
    fireEvent.click(approveBtn);
    expect(onAddStamp).toHaveBeenCalledWith("APPROVED");

  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DocumentAnnotator title="Tax Invoice" documentNumber="INV-100">
        <div>Content</div>
      </DocumentAnnotator>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
