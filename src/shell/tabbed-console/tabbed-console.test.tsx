import { render, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { TabbedConsole } from "./tabbed-console";

describe("TabbedConsole", () => {
  const tabs = [
    { id: "tab-1", title: "Tab 1", content: <div>Content 1</div> },
    { id: "tab-2", title: "Tab 2", content: <div>Content 2</div> },
  ];

  it("switches tabs on click", () => {
    const onTabChange = vi.fn();
    const { getByText } = render(
      <TabbedConsole tabs={tabs} onTabChange={onTabChange} />,
    );
    expect(getByText("Content 1")).toBeDefined();
    fireEvent.click(getByText("Tab 2"));
    expect(onTabChange).toHaveBeenCalledWith("tab-2");
    expect(getByText("Content 2")).toBeDefined();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<TabbedConsole tabs={tabs} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
