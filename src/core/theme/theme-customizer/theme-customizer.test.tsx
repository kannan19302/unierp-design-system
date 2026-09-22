import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ThemeCustomizer } from "../theme-customizer";

describe("ThemeCustomizer Primitive", () => {
  it("renders customizer fields and preview", () => {
    const onSave = vi.fn();
    render(
      <ThemeCustomizer
        initialConfig={{ tenantName: "Test Enterprise", brandPrimary: "#0f766e" }}
        onSave={onSave}
      />
    );

    expect(screen.getByText("Tenant Theme Customizer & White-Label Studio")).toBeInTheDocument();
    expect(screen.getByText("Primary Button")).toBeInTheDocument();

    const saveBtn = screen.getByText("Save Theme");
    fireEvent.click(saveBtn);
    expect(onSave).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ThemeCustomizer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
