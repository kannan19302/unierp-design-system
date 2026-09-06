import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { DocumentUploadForm } from "./document-upload-form";

const defaultProps = {} as any;

describe("DocumentUploadForm", () => {
  it("renders without crashing", () => {
    render(<DocumentUploadForm {...defaultProps} acceptedTypes={['PDF', 'PNG', 'JPG', 'XLSX']} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<DocumentUploadForm {...defaultProps} acceptedTypes={['PDF', 'PNG', 'JPG', 'XLSX']} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
