import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "vitest-axe";
import { StatCardRow } from "../../compositions/stat-card";
import { ListPageTemplate } from "./list-page";
import { DetailPageTemplate } from "../detail-page/detail-page";

describe("StatCardRow", () => {
  it("renders stat labels and values", () => {
    render(
      <StatCardRow
        stats={[
          { label: "Products", value: 42 },
          { label: "Users", value: "1.2K" },
        ]}
      />,
    );
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("1.2K")).toBeInTheDocument();
  });

  it("shows loading skeleton when loading=true", () => {
    const { container } = render(
      <StatCardRow stats={[{ label: "Revenue", value: 0, loading: true }]} />,
    );
    // Skeleton renders an aria-hidden span; no numeric value shown
    expect(screen.queryByText("0")).not.toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
});

describe("ListPageTemplate", () => {
  const columns = [
    { key: "name", header: "Name" },
    { key: "role", header: "Role" },
  ];
  const data = [
    { name: "Alice", role: "Admin" },
    { name: "Bob", role: "Member" },
  ];

  it("renders column headers and rows", () => {
    render(<ListPageTemplate title="Users" columns={columns} data={data} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("fires onRowClick when a row is clicked", () => {
    const onRowClick = vi.fn();
    render(
      <ListPageTemplate
        title="Users"
        columns={columns}
        data={data}
        onRowClick={onRowClick}
      />,
    );
    fireEvent.click(screen.getByText("Alice"));
    expect(onRowClick).toHaveBeenCalledWith({ name: "Alice", role: "Admin" });
  });

  it("shows empty state when data is empty", () => {
    render(
      <ListPageTemplate
        title="Users"
        columns={columns}
        data={[]}
        emptyTitle="Nothing here"
      />,
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ListPageTemplate
        title="Users"
        columns={columns}
        data={data}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("annotates slots with data-slot attributes", () => {
    const { container } = render(
      <ListPageTemplate
        title="Users"
        columns={columns}
        data={data}
        searchable
        filters={[{ key: "role", label: "Role", options: [{ label: "Admin", value: "Admin" }] }]}
        pagination={{ page: 1, pageSize: 10, total: 2, onPageChange: () => {} }}
      />,
    );
    expect(container.querySelector('[data-slot="list-page"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="list-page-toolbar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="list-page-search-wrap"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="list-page-search-input"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="list-page-filter-select"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="list-page-table-card"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="list-page-table"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="list-page-th"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-slot="list-page-td"]')).toHaveLength(4);
    expect(container.querySelector('[data-slot="list-page-pagination"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="list-page-pagination-actions"]')).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(
      <ListPageTemplate title="Users" columns={columns} data={data} density="compact" />,
    );
    const root = container.querySelector('[data-slot="list-page"]');
    expect(root).toHaveAttribute("data-density", "compact");
    expect(root?.className).toContain("density_compact");

    rerender(<ListPageTemplate title="Users" columns={columns} data={data} density="ultra-compact" />);
    expect(root).toHaveAttribute("data-density", "ultra-compact");
    expect(root?.className).toContain("density_ultra_compact");
  });
});


describe("DetailPageTemplate", () => {
  const tabs = [
    { key: "overview", label: "Overview", content: <div>Overview panel</div> },
    {
      key: "activity",
      label: "Activity",
      count: 5,
      content: <div>Activity panel</div>,
    },
  ];

  it("renders title and first tab panel", () => {
    render(<DetailPageTemplate title="Acme Corp" tabs={tabs} />);
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Overview panel")).toBeInTheDocument();
  });

  it("switches tab on click", () => {
    render(<DetailPageTemplate title="Acme Corp" tabs={tabs} />);
    fireEvent.click(screen.getByRole("tab", { name: /Activity/i }));
    expect(screen.getByText("Activity panel")).toBeInTheDocument();
  });

  it("calls onBack when back button clicked", () => {
    const onBack = vi.fn();
    render(
      <DetailPageTemplate
        title="X"
        tabs={tabs}
        onBack={onBack}
        backLabel="Go back"
      />,
    );
    fireEvent.click(screen.getByText(/Go back/));
    expect(onBack).toHaveBeenCalled();
  });
});
