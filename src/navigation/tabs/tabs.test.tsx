import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

describe("Tabs Component", () => {
  it("renders tab buttons and handles tab selection in flat mode", () => {
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

  it("applies data-slot annotations throughout component anatomy", () => {
    const { container } = render(
      <Tabs
        value="tab1"
        tabs={[
          { key: "tab1", label: "Tab One", badge: "5", icon: <span>*</span> },
        ]}
      />
    );

    expect(container.querySelector('[data-slot="tabs"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="tabs-trigger"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="tabs-label"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="tabs-badge"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="tabs-icon"]')).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const { rerender, container } = render(
      <Tabs density="ultra-compact" tabs={[{ key: "1", label: "Item" }]} />
    );
    expect(container.querySelector('[data-slot="tabs"]')?.className).toContain("densityUltraCompact");

    rerender(<Tabs density="compact" tabs={[{ key: "1", label: "Item" }]} />);
    expect(container.querySelector('[data-slot="tabs"]')?.className).toContain("densityCompact");

    rerender(<Tabs density="standard" tabs={[{ key: "1", label: "Item" }]} />);
    expect(container.querySelector('[data-slot="tabs"]')?.className).toContain("densityStandard");

    rerender(<Tabs density="comfortable" tabs={[{ key: "1", label: "Item" }]} />);
    expect(container.querySelector('[data-slot="tabs"]')?.className).toContain("densityComfortable");
  });

  it("renders and operates with compound components", () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview Panel Content</TabsContent>
        <TabsContent value="billing">Billing Panel Content</TabsContent>
      </Tabs>
    );

    expect(screen.getByText("Overview Panel Content")).toBeInTheDocument();
    expect(screen.queryByText("Billing Panel Content")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Billing" }));
    expect(screen.getByText("Billing Panel Content")).toBeInTheDocument();
    expect(screen.queryByText("Overview Panel Content")).not.toBeInTheDocument();
  });

  it("forwards ref to the div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tabs
        ref={ref}
        value="a"
        onChange={() => {}}
        tabs={[{ key: "a", label: "Overview" }]}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
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
