import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ProfileCard, profileCardVariants } from "./profile-card";

describe("ProfileCard Component", () => {
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

  it("forwards ref to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ProfileCard ref={ref} name="Jane Doe" email="jane@example.com" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("data-slot", "profile-card");
  });

  it("renders data-slot annotations on anatomy", () => {
    const { container } = render(
      <ProfileCard
        name="Jane Doe"
        email="jane@example.com"
        role="Engineer"
        tenantName="Acme"
        variant="full"
      />
    );
    expect(container.querySelector('[data-slot="profile-card"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="profile-card-avatar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="profile-card-info"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="profile-card-name"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="profile-card-email"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="profile-card-role-badge"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="profile-card-tenant-tag"]')).toBeInTheDocument();
  });

  it("supports strict 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <ProfileCard name="Jane Doe" email="jane@example.com" density={density} />
      );
      const root = container.querySelector('[data-slot="profile-card"]');
      expect(root).toHaveAttribute("data-density", density);
    });

    const classes = profileCardVariants({ density: "compact", variant: "compact" });
    expect(classes).toContain("densityCompact");
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
