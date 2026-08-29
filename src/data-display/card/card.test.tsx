import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Card } from "./card";

describe("Card Primitive", () => {
  it("renders card content", () => {
    render(<Card>Card Body</Card>);
    expect(screen.getByText("Card Body")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<Card>Accessible Card</Card>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
