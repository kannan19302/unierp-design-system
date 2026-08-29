import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Box } from "lucide-react";
import { ModuleTabLayout, type ModuleTab } from "../module-tab-layout";

vi.mock("next/navigation", () => ({
  usePathname: () => "/inventory",
  useSearchParams: () => new URLSearchParams(),
}));

const mockTabs: ModuleTab[] = [
  { id: "overview", label: "Overview", href: "/inventory" },
  { id: "stock", label: "Stock Items", href: "/inventory/stock", isDirty: true, badge: 42 },
  { id: "transfers", label: "Transfers", href: "/inventory/transfers", closable: true },
];

describe("ModuleTabLayout dirty state and closable tabs", () => {
  it("renders dirty dot for unsaved tabs", () => {
    render(
      <ModuleTabLayout
        tabs={mockTabs}
        moduleId="inv"
        moduleLabel="Inventory"
        moduleIcon={Box}
        moduleDescription="Manage stock"
      />,
    );

    expect(screen.getByLabelText("Unsaved changes")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("triggers onCloseTab when close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <ModuleTabLayout
        tabs={mockTabs}
        moduleId="inv"
        moduleLabel="Inventory"
        moduleIcon={Box}
        moduleDescription="Manage stock"
        onCloseTab={onClose}
      />,
    );

    const closeBtn = screen.getByLabelText("Close Transfers tab");
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledWith("transfers");
  });
});
