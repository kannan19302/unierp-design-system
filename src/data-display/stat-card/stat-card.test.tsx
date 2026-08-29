import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { KPIStrip, StatCard } from "./stat-card";

describe("KPIStrip & StatCard Primitive", () => {
  it("renders metric cards and handles clicks", () => {
    const onClick = vi.fn();
    render(
      <KPIStrip
        items={[
          { id: "1", label: "Revenue", value: "$100k", delta: "+5%", trend: "up", onClick },
        ]}
      />
    );
    expect(screen.getByRole("region", { name: "Key Performance Indicators" })).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$100k")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders single StatCard", () => {
    render(<StatCard id="kpi" label="Headcount" value="42" />);
    expect(screen.getByText("Headcount")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <KPIStrip
        items={[{ id: "1", label: "Margin", value: "24%" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
