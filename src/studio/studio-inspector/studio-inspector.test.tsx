import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { StudioInspector } from "./studio-inspector";

describe("StudioInspector Primitive", () => {
  it("renders tabs and switches between inspector panes", () => {
    render(
      <StudioInspector
        subject="Email Input"
        properties={<div>Field Label & Validation</div>}
        logic={<div>Conditional Visibility Rules</div>}
      />
    );

    expect(screen.getByText("Properties")).toBeInTheDocument();
    expect(screen.getByText("Field Label & Validation")).toBeInTheDocument();

    const logicTab = screen.getByRole("tab", { name: "Logic" });
    fireEvent.click(logicTab);
    expect(screen.getByText("Conditional Visibility Rules")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <StudioInspector
        subject="Email Input"
        properties={<div>Properties Panel</div>}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
