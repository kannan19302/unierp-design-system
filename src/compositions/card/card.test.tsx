import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { axe } from "vitest-axe";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
} from "./card";

describe("Card Primitive", () => {
  it("forwards ref to card container", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref Card</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("data-slot", "card");
  });

  it("renders card content", () => {
    render(<Card>Card Body</Card>);
    expect(screen.getByText("Card Body")).toBeInTheDocument();
  });

  it("renders compound card anatomy with data-slot attributes", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Invoice #INV-2026-001</CardTitle>
          <CardDescription>Billed to Acme Corporation</CardDescription>
        </CardHeader>
        <CardContent>
          <div>Amount Due: $12,450.00</div>
        </CardContent>
        <CardFooter>
          <button type="button">Download PDF</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText("Invoice #INV-2026-001")).toBeInTheDocument();
    expect(screen.getByText("Billed to Acme Corporation")).toBeInTheDocument();
    expect(screen.getByText("Amount Due: $12,450.00")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download PDF" })).toBeInTheDocument();

    expect(document.querySelector("[data-slot='card-header']")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='card-title']")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='card-description']")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='card-content']")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='card-footer']")).toBeInTheDocument();
  });

  it("generates correct class names via cardVariants cva helper", () => {
    const classes = cardVariants({ padding: "lg", hover: true });
    expect(classes).toContain("p_lg");
    expect(classes).toContain("hoverable");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<Card>Accessible Card</Card>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
