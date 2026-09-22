import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { SplitButton } from "./split-button";

describe("SplitButton Component", () => {
  const items = [
    { id: "item1", label: "Action One", onClick: vi.fn() },
    { id: "item2", label: "Action Two", onClick: vi.fn() },
  ];

  it("fires primary onClick when clicking main button", () => {
    const onClick = vi.fn();
    render(<SplitButton label="Create Invoice" onClick={onClick} items={items} />);

    fireEvent.click(screen.getByRole("button", { name: "Create Invoice" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("opens menu when clicking toggle button and selects item", () => {
    const onItemClick = vi.fn();
    const testItems = [{ id: "opt", label: "Special Action", onClick: onItemClick }];

    render(<SplitButton label="Process" onClick={() => {}} items={testItems} />);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /more options/i }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("menuitem", { name: "Special Action" }));
    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("has zero accessibility violations in closed state", async () => {
    const { container } = render(
      <SplitButton label="Publish" onClick={() => {}} items={items} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has zero accessibility violations in open state", async () => {
    const { container } = render(
      <SplitButton label="Publish" onClick={() => {}} items={items} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /more options/i }));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
