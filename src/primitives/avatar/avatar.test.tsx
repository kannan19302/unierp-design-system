import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Avatar, AvatarGroup } from "./avatar";

describe("Avatar Primitive", () => {
  it("renders user initials accurately", () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders single initial for single name", () => {
    render(<Avatar name="Administrator" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar name="Sarah Connor" />
        <Avatar name="John Connor" />
      </AvatarGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
