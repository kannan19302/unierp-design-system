import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "./button";

describe("Button Primitive", () => {
  it("renders children correctly", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("handles click events", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables button when disabled or isLoading is true", () => {
    const { rerender } = render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();

    rerender(<Button isLoading>Loading</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<Button variant="primary">Accessible Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders polymorphically with asChild and a real anchor child", () => {
    render(
      <Button asChild variant="secondary">
        <a href="/dashboard">Go to Dashboard</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: /go to dashboard/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
    expect(link.className).toContain("button");
  });

  it("handles disabled state on polymorphic anchor by setting aria-disabled and preventing click", () => {
    const onClick = vi.fn();
    render(
      <Button asChild disabled onClick={onClick}>
        <a href="/restricted">Restricted Area</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: /restricted area/i });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");

    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("sets aria-busy when isLoading is true", () => {
    render(<Button isLoading>Processing</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });
});
