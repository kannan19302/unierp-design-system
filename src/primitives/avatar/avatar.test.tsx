import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Avatar, AvatarGroup, AvatarImage, AvatarFallback, avatarVariants } from "./avatar";

describe("Avatar Primitive", () => {
  it("renders user initials accurately with data-slot attributes", () => {
    render(<Avatar name="John Doe" />);
    const avatar = screen.getByText("JD").closest("[data-slot='avatar']");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("data-size", "md");
    expect(avatar).toHaveAttribute("data-shape", "circle");
  });

  it("renders single initial for single name", () => {
    render(<Avatar name="Administrator" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders with presence status", () => {
    render(<Avatar name="John Doe" presence="online" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='avatar-presence']")).toBeInTheDocument();
  });

  it("renders square shape", () => {
    const { container } = render(<Avatar name="Team Workspace" shape="square" />);
    expect(container.querySelector('[data-shape="square"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute("data-shape", "square");
  });

  it("renders compound Avatar with AvatarImage and AvatarFallback", () => {
    render(
      <Avatar>
        <AvatarFallback>TC</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("TC")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='avatar-fallback']")).toBeInTheDocument();
  });

  it("generates correct classes via avatarVariants cva helper", () => {
    const classes = avatarVariants({ size: "xl", shape: "square" });
    expect(classes).toContain("xl");
    expect(classes).toContain("square");
  });

  it("renders AvatarGroup with data-slot", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Sarah Connor" />
        <Avatar name="John Connor" />
        <Avatar name="Kyle Reese" />
      </AvatarGroup>
    );
    expect(document.querySelector("[data-slot='avatar-group']")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='avatar-group-excess']")).toBeInTheDocument();
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
