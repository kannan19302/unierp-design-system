import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TabContextMenu } from "./tab-context-menu";

describe("TabContextMenu", () => {
  it("dispatches a consumer callback and dismisses after selection", () => {
    const onDuplicateTab = vi.fn();
    const onClose = vi.fn();
    render(
      <TabContextMenu
        target={{ type: "tab", tabId: "gl", tabTitle: "General ledger", tabHref: "/finance/gl", pinned: false, closable: true, index: 0, totalTabs: 2 }}
        position={{ x: 20, y: 30 }}
        onClose={onClose}
        onDuplicateTab={onDuplicateTab}
      />,
    );

    fireEvent.click(screen.getByRole("menuitem", { name: "Duplicate tab" }));
    expect(onDuplicateTab).toHaveBeenCalledWith("gl");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("disables closing a pinned tab and closes from Escape", () => {
    const onClose = vi.fn();
    render(
      <TabContextMenu
        target={{ type: "tab", tabId: "home", tabTitle: "Overview", tabHref: "/finance", pinned: true, closable: false, index: 0, totalTabs: 1 }}
        position={{ x: 20, y: 30 }}
        onClose={onClose}
        onCloseTab={vi.fn()}
      />,
    );

    expect(screen.getByRole("menuitem", { name: /^Close tab\s+Ctrl\+W$/ })).toBeDisabled();
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
