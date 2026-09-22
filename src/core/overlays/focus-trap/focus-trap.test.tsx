import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { FocusTrap } from "./focus-trap";

describe("FocusTrap Component", () => {
  it("focuses first element inside trap on mount", () => {
    render(
      <div>
        <button type="button">Outside Before</button>
        <FocusTrap active={true}>
          <div>
            <button type="button">Trapped First</button>
            <button type="button">Trapped Second</button>
          </div>
        </FocusTrap>
      </div>,
    );

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Trapped First" }));
  });

  it("calls onEscape when Escape key is pressed", () => {
    const onEscape = vi.fn();
    render(
      <FocusTrap active={true} onEscape={onEscape}>
        <div>
          <button type="button">Inside</button>
        </div>
      </FocusTrap>,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <FocusTrap active={true}>
        <div>
          <button type="button">Accessible Button</button>
        </div>
      </FocusTrap>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
