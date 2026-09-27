import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Avatar, AvatarGroup, AvatarImage, AvatarFallback } from "./avatar";

describe("Avatar Primitive", () => {
  it("renders user initials accurately", () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders single initial for single name", () => {
    render(<Avatar name="Administrator" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders with presence status", () => {
    render(<Avatar name="John Doe" presence="online" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders square shape", () => {
    const { container } = render(<Avatar name="Team Workspace" shape="square" />);
    expect(container.querySelector('[data-shape="square"]')).toBeInTheDocument();
  });

  it("renders compound Avatar with AvatarImage and AvatarFallback", () => {
    render(
      <Avatar>
        <AvatarFallback>TC</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("TC")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar name="Sarah Connor" presence="online" />
        <Avatar name="John Connor" shape="square" />
      </AvatarGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

