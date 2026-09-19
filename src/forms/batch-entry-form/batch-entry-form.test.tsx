import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { BatchEntryForm } from "./batch-entry-form";

describe("BatchEntryForm", () => {
  it("renders table with columns and supports cell updates and submission", () => {
    const onSubmit = vi.fn();
    render(
      <BatchEntryForm
        columns={["ColA", "ColB"]}
        initialRows={2}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByRole("region")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "ColA" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "ColB" })).toBeInTheDocument();

    const input = screen.getByLabelText("ColA row 1");
    fireEvent.change(input, { target: { value: "Val1" } });
    expect(input).toHaveValue("Val1");

    fireEvent.click(screen.getByRole("button", { name: "+ Add Row" }));
    expect(screen.getAllByRole("row").length).toBe(4); // 1 header row + 3 data rows

    fireEvent.click(screen.getByRole("button", { name: /Submit Batch/i }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("forwards ref correctly to the container region", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<BatchEntryForm ref={ref} columns={["A", "B"]} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "region");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <BatchEntryForm columns={["Date", "Description", "Debit", "Credit"]} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
