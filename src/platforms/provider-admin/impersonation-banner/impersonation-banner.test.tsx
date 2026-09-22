import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ImpersonationBanner } from "./impersonation-banner";

describe("ImpersonationBanner Platform Component", () => {
  it("renders when tenantName is provided", () => {
    render(<ImpersonationBanner tenantName="Stark Industries" />);
    expect(screen.getByText(/Stark Industries/i)).toBeInTheDocument();
  });

  it("returns null when no tenantName is set", () => {
    const { container } = render(<ImpersonationBanner />);
    expect(container.firstChild).toBeNull();
  });

  it("calls onEndImpersonation and dismisses banner", () => {
    const onEnd = vi.fn();
    render(<ImpersonationBanner tenantName="Stark Industries" onEndImpersonation={onEnd} />);
    const endBtn = screen.getByRole("button", { name: /End Impersonation/i });
    fireEvent.click(endBtn);
    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/Stark Industries/i)).not.toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ImpersonationBanner tenantName="Stark Industries" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
