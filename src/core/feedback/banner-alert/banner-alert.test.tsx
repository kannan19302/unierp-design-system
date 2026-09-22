import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { BannerAlert } from "./banner-alert";

describe("BannerAlert Component", () => {
  it("renders with alert role and title", () => {
    render(<BannerAlert title="Security Alert">Audit log updated</BannerAlert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Security Alert")).toBeInTheDocument();
  });

  it("calls onDismiss when close button is clicked", () => {
    const onDismiss = vi.fn();
    render(<BannerAlert onDismiss={onDismiss}>Dismissible notice</BannerAlert>);
    const closeBtn = screen.getByRole("button", { name: /dismiss banner/i });
    fireEvent.click(closeBtn);
    expect(onDismiss).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <BannerAlert title="Accessible Banner">Content passes WCAG AA</BannerAlert>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
