import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DataQueryDrawer } from "./data-query-drawer";

describe("DataQueryDrawer Component", () => {
  const sampleResults = {
    columns: ["id", "name"],
    rows: [{ id: "1", name: "Acme Corp" }],
  };

  it("renders query name, source type, and results preview when open", () => {
    const onToggle = vi.fn();
    render(
      <DataQueryDrawer
        queryName="getSuppliers"
        sourceType="PostgreSQL"
        isOpen={true}
        onToggleOpen={onToggle}
        queryText="SELECT * FROM suppliers"
        results={sampleResults}
      />
    );

    expect(screen.getByText("getSuppliers")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();

    const toggleBtn = screen.getByRole("button", { name: "Collapse query drawer" });
    fireEvent.click(toggleBtn);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("executes onRunQuery when Run Query button is clicked", () => {
    const onRun = vi.fn();
    render(
      <DataQueryDrawer
        queryName="testQuery"
        isOpen={true}
        onToggleOpen={() => {}}
        onRunQuery={onRun}
        queryText="SELECT 1"
      />
    );

    const runBtn = screen.getByRole("button", { name: "Execute query" });
    fireEvent.click(runBtn);
    expect(onRun).toHaveBeenCalledTimes(1);
  });

  it("switches to editor tab and allows modifying query text", () => {
    const onChange = vi.fn();
    render(
      <DataQueryDrawer
        queryName="testQuery"
        isOpen={true}
        onToggleOpen={() => {}}
        queryText="SELECT * FROM test"
        onChangeQueryText={onChange}
      />
    );

    const editorTab = screen.getByRole("tab", { name: "Query SQL" });
    fireEvent.click(editorTab);

    const textarea = screen.getByLabelText("Query Code Editor");
    fireEvent.change(textarea, { target: { value: "SELECT id FROM test" } });
    expect(onChange).toHaveBeenCalledWith("SELECT id FROM test");
  });

  it("forwards ref to outer container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DataQueryDrawer
        ref={ref}
        queryName="refQuery"
        isOpen={false}
        onToggleOpen={() => {}}
        queryText=""
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DataQueryDrawer
        queryName="a11yQuery"
        isOpen={true}
        onToggleOpen={() => {}}
        queryText="SELECT 1"
        results={sampleResults}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
