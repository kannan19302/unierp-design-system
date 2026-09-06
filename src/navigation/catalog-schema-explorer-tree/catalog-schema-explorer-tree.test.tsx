import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { CatalogSchemaExplorerTree } from "./catalog-schema-explorer-tree";

describe("CatalogSchemaExplorerTree", () => {
  it("renders with zero axe accessibility violations", async () => {
    const { container } = render(<CatalogSchemaExplorerTree />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders database schemas and tables", () => {
    render(<CatalogSchemaExplorerTree />);
    expect(screen.getByText("Schema Explorer")).toBeInTheDocument();
    expect(screen.getByText("unierp_enterprise_prod")).toBeInTheDocument();
    expect(screen.getByText("finance")).toBeInTheDocument();
    expect(screen.getByText("gl_journal_entries")).toBeInTheDocument();
  });

  it("handles searching and selecting tree nodes", () => {
    const onSelect = vi.fn();
    render(<CatalogSchemaExplorerTree onSelectNode={onSelect} />);

    const searchInput = screen.getByPlaceholderText(/Search schema, table/i);
    fireEvent.change(searchInput, { target: { value: "profit_loss" } });

    expect(screen.getByText("v_profit_loss_ytd")).toBeInTheDocument();

    const viewBtn = screen.getByRole("button", { name: /v_profit_loss_ytd/i });
    fireEvent.click(viewBtn);

    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "view_pl_summary" }));
  });
});
