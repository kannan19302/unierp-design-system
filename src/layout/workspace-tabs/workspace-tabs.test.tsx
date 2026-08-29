import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { WorkspaceTabs, type WorkspaceTabItem } from "./workspace-tabs";

const sampleTabs: WorkspaceTabItem[] = [
  { id: "tab-1", title: "Dashboard", pinned: true, closable: false },
  { id: "tab-2", title: "Invoice #1024", dirty: true, badge: 3 },
  { id: "tab-3", title: "Settings", closable: true },
];

describe("WorkspaceTabs", () => {
  it("renders all tabs with accessible attributes", () => {
    const onSelect = vi.fn();
    render(
      <WorkspaceTabs
        tabs={sampleTabs}
        activeTabId="tab-2"
        onSelectTab={onSelect}
      />
    );

    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
  });

  it("handles tab selection and closing", () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();

    render(
      <WorkspaceTabs
        tabs={sampleTabs}
        activeTabId="tab-1"
        onSelectTab={onSelect}
        onCloseTab={onClose}
      />
    );

    fireEvent.click(screen.getByText("Invoice #1024"));
    expect(onSelect).toHaveBeenCalledWith("tab-2");

    const closeButtons = screen.getAllByLabelText(/Close/i);
    expect(closeButtons.length).toBeGreaterThan(0);
    fireEvent.click(closeButtons[0]!);
    expect(onClose).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <WorkspaceTabs
        tabs={sampleTabs}
        activeTabId="tab-1"
        onSelectTab={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
