import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DemoBanner } from "./demo-banner";

describe("DemoBanner Primitive", () => {
  it("renders banner text and triggers confirmation on remove", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<DemoBanner currentModule="Finance" />);

    expect(screen.getByText("Using demo data")).toBeInTheDocument();
    expect(screen.getByText("Remove all demo data")).toBeInTheDocument();
    expect(screen.getByText("Remove from this app")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Remove from this app"));
    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<DemoBanner currentModule="CRM" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
