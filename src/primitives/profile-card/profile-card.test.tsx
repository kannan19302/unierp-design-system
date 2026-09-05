import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ProfileCard } from "./profile-card";

describe("ProfileCard Primitive", () => {
  it("renders compact profile card correctly with initials fallback", () => {
    render(<ProfileCard name="Jane Doe" email="jane@example.com" variant="compact" />);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders full profile card with role and tenant", () => {
    render(
      <ProfileCard
        name="Marcus Vance"
        email="marcus@example.com"
        role="Finance Director"
        tenantName="Acme Corp"
        variant="full"
      />
    );
    expect(screen.getByText("Marcus Vance")).toBeInTheDocument();
    expect(screen.getByText("marcus@example.com")).toBeInTheDocument();
    expect(screen.getByText("Finance Director")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });

  it("renders avatar image when avatarUrl is provided", () => {
    render(
      <ProfileCard
        name="Alex Rivera"
        email="alex@example.com"
        avatarUrl="https://example.com/avatar.jpg"
        variant="compact"
      />
    );
    const img = screen.getByRole("img", { name: "Alex Rivera's avatar" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ProfileCard
        name="Sarah Connor"
        email="sarah@resistance.net"
        role="Operations Lead"
        variant="full"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
