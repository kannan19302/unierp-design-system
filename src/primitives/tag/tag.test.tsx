import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Tag } from "./tag";

describe("Tag Primitive", () => {
  it("renders tag label correctly and exposes data-slot", () => {
    const { container } = render(<Tag variant="primary" shape="pill">Finance</Tag>);
    expect(screen.getByText("Finance")).toBeInTheDocument();
    const tag = container.querySelector('[data-slot="tag"]');
    expect(tag).toBeInTheDocument();
    expect(tag).toHaveAttribute("data-variant", "primary");
    expect(tag).toHaveAttribute("data-shape", "pill");
    expect(container.querySelector('[data-slot="tag-label"]')).toBeInTheDocument();
  });

  it("handles remove callback with data-slot", () => {
    const onRemove = vi.fn();
    const { container } = render(<Tag onRemove={onRemove}>Removable</Tag>);
    const removeBtn = screen.getByLabelText("Remove tag");
    expect(container.querySelector('[data-slot="tag-remove"]')).toBe(removeBtn);
    fireEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<Tag onRemove={() => {}}>Accessible Tag</Tag>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
