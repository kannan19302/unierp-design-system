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
// vitest-axe, not jest-axe: jest-axe is not a dependency of this package, so
// this import failed to resolve and Vitest could not even load the suite —
// it reported as a failed FILE, and none of its assertions had ever run.
// Every other test here uses vitest-axe, and vitest.setup.ts already does
// expect.extend(vitest-axe/matchers) globally, so toHaveNoViolations is
// registered without extending it again below.
import { axe } from "vitest-axe";
import { Drawer, DropdownMenu, ContextMenu } from "../index";

// ── Drawer: focus trap ────────────────────────────────
describe("Drawer — focus trap", () => {
  // These three replace two earlier tests that asserted initial focus landed on
  // the first CONTENT button and that the Tab cycle contained only the caller's
  // children. Both expectations were wrong: the drawer's header "Close drawer"
  // button is a real, focusable control inside the dialog, so excluding it from
  // the cycle would leave a keyboard-only user unable to dismiss the drawer
  // (WCAG 2.1.1), and focusing a content button skips the dialog's own
  // accessible name. The component is now correct and these encode that.
  it("moves focus to the dialog itself on open", () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Test drawer">
        <button data-testid="first">First</button>
        <button data-testid="second">Second</button>
      </Drawer>
    );
    // WAI-ARIA APG, Dialog Modal pattern: the container carries role="dialog"
    // and aria-label, so focusing it is what makes a screen reader announce
    // "Test drawer, dialog" on open.
    expect(document.activeElement).toBe(screen.getByRole("dialog"));
  });

  it("traps Tab within the drawer, close button included", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Test drawer">
        <button data-testid="first">First</button>
        <button data-testid="second">Second</button>
      </Drawer>
    );
    const close = screen.getByRole("button", { name: "Close drawer" });
    const first = screen.getByTestId("first");
    const second = screen.getByTestId("second");

    // Close is first in DOM order, so it is the first stop from the container.
    await user.tab();
    expect(document.activeElement).toBe(close);
    await user.tab();
    expect(document.activeElement).toBe(first);
    await user.tab();
    expect(document.activeElement).toBe(second);
    // ...and the cycle wraps rather than escaping to the page behind.
    await user.tab();
    expect(document.activeElement).toBe(close);
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
    const close = screen.getByRole("button", { name: "Close drawer" });
    const first = screen.getByTestId("first");
    const last = screen.getByTestId("last");

    // Backwards from the dialog container lands on the LAST focusable.
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(last);
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(first);
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(close);
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

// ── ContextMenu: keyboard ─────────────────────────────
// This component had no tests at all, and no keyboard handling: it could be
// opened with a right-click and then not driven. It also called useFocusTrap,
// which was inert only because the trap itself was broken — fixing the trap
// would have silently armed it on a menu, where trapping is wrong.
describe("ContextMenu — keyboard navigation", () => {
  it("opens on contextmenu and invokes an item with ArrowDown + Enter", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <ContextMenu items={[{ key: "a", label: "Alpha", onClick: onAction }]}>
        <span data-testid="target">Right-click me</span>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByTestId("target"));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu items={[{ key: "a", label: "Alpha", onClick: vi.fn() }]}>
        <span data-testid="target">Right-click me</span>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByTestId("target"));
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
