import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { DocumentUploadForm } from "./document-upload-form";

describe("DocumentUploadForm", () => {
  it("renders dropzone and displays uploaded files list", () => {
    render(
      <DocumentUploadForm
        title="Upload Documents"
        initialFileNames={["file1.pdf", "file2.png"]}
      />
    );

    expect(screen.getByRole("region", { name: "Upload Documents" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upload files dropzone" })).toBeInTheDocument();
    expect(screen.getByText("file1.pdf")).toBeInTheDocument();
    expect(screen.getByText("file2.png")).toBeInTheDocument();

    const removeBtn = screen.getByRole("button", { name: "Remove file1.pdf" });
    fireEvent.click(removeBtn);
    expect(screen.queryByText("file1.pdf")).not.toBeInTheDocument();
  });

  it("forwards ref correctly to the container region", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<DocumentUploadForm ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "region");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DocumentUploadForm acceptedTypes={["PDF", "PNG", "JPG", "XLSX"]} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
