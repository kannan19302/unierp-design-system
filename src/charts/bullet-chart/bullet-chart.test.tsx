import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { BulletChart } from "./bullet-chart";

describe("BulletChart", () => {
  it("renders without crashing", () => {
    
    render(<BulletChart label="Revenue" actual={275} target={300} ranges={[150, 225, 350]} />);
    expect(screen.getByRole('img', { name: /revenue bullet chart/i })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    
    const { container } = render(<BulletChart label="Revenue" actual={275} target={300} ranges={[150, 225, 350]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
