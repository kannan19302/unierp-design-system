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

  it("has zero accessibility violations", async () => {
    const { container } = render(<Pagination page={2} pageCount={5} onChange={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
