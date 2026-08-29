import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Tabs } from "./tabs";

describe("Tabs Primitive", () => {
  it("renders tab buttons and handles tab selection", () => {
    const onChange = vi.fn();
    render(
      <Tabs
        value="tab1"
        onChange={onChange}
        tabs={[
          { key: "tab1", label: "Tab One" },
          { key: "tab2", label: "Tab Two" },
        ]}
      />
    );
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByText("Tab One")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Tab Two"));
    expect(onChange).toHaveBeenCalledWith("tab2");
  });

  it("navigates tabs with keyboard arrow keys", () => {
    const onChange = vi.fn();
    render(
      <Tabs
        value="tab1"
        onChange={onChange}
        tabs={[
          { key: "tab1", label: "Tab One" },
          { key: "tab2", label: "Tab Two" },
        ]}
      />
    );
    const tablist = screen.getByRole("tablist");
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("tab2");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <Tabs
        value="a"
        onChange={() => {}}
        tabs={[
          { key: "a", label: "Overview" },
          { key: "b", label: "Settings" },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
