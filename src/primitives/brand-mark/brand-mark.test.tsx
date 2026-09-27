import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { BrandMark, brandMarkVariants } from "./brand-mark";

describe("BrandMark Primitive", () => {
  it("renders with aria-label UniERP and data-slot attributes", () => {
    render(<BrandMark />);
    const mark = screen.getByLabelText("UniERP");
    expect(mark).toBeInTheDocument();
    expect(mark).toHaveAttribute("data-slot", "brand-mark");
    expect(mark).toHaveAttribute("data-size", "md");
    expect(document.querySelector("[data-slot='brand-mark-icon']")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='brand-mark-text']")).toBeInTheDocument();
  });

  it("hides text in compact mode", () => {
    render(<BrandMark compact />);
    expect(screen.queryByText("Uni")).not.toBeInTheDocument();
    expect(screen.getByLabelText("UniERP")).toHaveAttribute("data-compact", "true");
  });

  it("generates correct classes via brandMarkVariants cva helper", () => {
    const classes = brandMarkVariants({ size: "lg", variant: "monochrome" });
    expect(classes).toContain("lg");
    expect(classes).toContain("variantMonochrome");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<BrandMark size="lg" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
