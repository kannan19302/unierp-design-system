/**
 * B02 — Overlays: axe accessibility and keyboard interaction tests.
 *
 * Exit criterion:
 *   - Focus is trapped inside modal overlays (Drawer/Sheet)
 *   - Focus is restored to trigger on close
 *   - Esc closes the overlay
 *   - No scroll-lock leak after close
 *   - axe reports zero violations
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { Drawer } from "../overlays";
import { DropdownMenu } from "../overlays";

expect.extend(toHaveNoViolations);

// ── Drawer: focus trap ────────────────────────────────
describe("Drawer — focus trap", () => {
  it("traps Tab within the drawer", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Test drawer">
        <button data-testid="first">First</button>
        <button data-testid="second">Second</button>
      </Drawer>
    );
    const first = screen.getByTestId("first");
    const second = screen.getByTestId("second");
    // First button should be focused after mount
    expect(document.activeElement).toBe(first);
    // Tab moves to second
    await user.tab();
    expect(document.activeElement).toBe(second);
    // Tab wraps back to first
    await user.tab();
    expect(document.activeElement).toBe(first);
  });

  it("traps Shift+Tab within the drawer", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Test drawer">
        <button data-testid="first">First</button>
        <button data-testid="last">Last</button>
      </Drawer>
    );
    const first = screen.getByTestId("first");
    const last = screen.getByTestId("last");
    expect(document.activeElement).toBe(first);
    // Shift+Tab wraps to last
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(last);
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Test">
        <button>Action</button>
      </Drawer>
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("applies scroll lock while open and removes it on close", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Drawer open onClose={onClose} title="Test">
        <p>content</p>
      </Drawer>
    );
    expect(document.body.style.overflow).toBe("hidden");
    rerender(
      <Drawer open={false} onClose={onClose} title="Test">
        <p>content</p>
      </Drawer>
    );
    // Scroll lock must be released
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});

// ── DropdownMenu: keyboard navigation ─────────────────
describe("DropdownMenu — keyboard navigation", () => {
  it("opens on click and supports ArrowDown/ArrowUp/Enter", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <DropdownMenu
        trigger={<button>Open</button>}
        items={[
          { key: "a", label: "Alpha", onClick: onAction },
          { key: "b", label: "Beta", onClick: vi.fn() },
        ]}
      />
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu
        trigger={<button>Open</button>}
        items={[{ key: "x", label: "X", onClick: vi.fn() }]}
      />
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});

// ── Axe: accessibility ────────────────────────────────
describe("Overlays — axe violations", () => {
  it("Drawer has no axe violations", async () => {
    const { container } = render(
      <Drawer open onClose={vi.fn()} title="Accessible drawer">
        <button>Action</button>
      </Drawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("DropdownMenu has no axe violations when open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DropdownMenu
        trigger={<button>Menu</button>}
        items={[{ key: "a", label: "Alpha", onClick: vi.fn() }]}
      />
    );
    await user.click(screen.getByText("Menu"));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
