import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Tag } from "./tag";

describe("Tag Primitive", () => {
  it("renders tag label correctly", () => {
    render(<Tag>Finance</Tag>);
    expect(screen.getByText("Finance")).toBeInTheDocument();
  });

  it("handles remove callback", () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>Removable</Tag>);
    fireEvent.click(screen.getByLabelText("Remove tag"));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<Tag onRemove={() => {}}>Accessible Tag</Tag>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
