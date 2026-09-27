import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Pagination } from "./pagination";

describe("Pagination Primitive", () => {
  it("renders page buttons and handles next/prev clicks", () => {
    const onChange = vi.fn();
    render(<Pagination page={3} pageCount={10} onChange={onChange} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("renders data-slot anatomy correctly", () => {
    render(
      <Pagination
        density="compact"
        page={4}
        pageCount={8}
        onChange={() => {}}
      />
    );
    const nav = document.querySelector('[data-slot="pagination"]');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("data-density", "compact");
    expect(document.querySelector('[data-slot="pagination-previous"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="pagination-next"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="pagination-button"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="pagination-ellipsis"]')).toBeInTheDocument();
  });

  it("forwards ref to the navigation element", () => {
    const ref = createRef<HTMLElement>();
    render(<Pagination ref={ref} page={3} pageCount={10} onChange={() => {}} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<Pagination page={2} pageCount={5} onChange={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
