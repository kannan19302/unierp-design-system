import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DesktopTitlebar } from "./desktop-titlebar";

describe("DesktopTitlebar Component", () => {
  it("renders desktop title and tenant badge", () => {
    render(<DesktopTitlebar title="Desktop Client" tenantName="Staging Corp" />);
    expect(screen.getByRole("region", { name: /desktop titlebar/i })).toBeInTheDocument();
    expect(screen.getByText("Desktop Client")).toBeInTheDocument();
    expect(screen.getByText("Staging Corp")).toBeInTheDocument();
  });

  it("calls control callbacks", () => {
    const onMinimize = vi.fn();
    const onMaximize = vi.fn();
    const onClose = vi.fn();
    render(
      <DesktopTitlebar
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /minimize window/i }));
    expect(onMinimize).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /maximize window/i }));
    expect(onMaximize).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /close window/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<DesktopTitlebar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
