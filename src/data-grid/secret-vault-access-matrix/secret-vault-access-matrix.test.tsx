import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { SecretVaultAccessMatrix } from "./secret-vault-access-matrix";

const mockSecrets = [
  {
    id: "sec_1",
    keyName: "DATABASE_URL",
    description: "Postgres URL",
    environments: {
      PRODUCTION: { value: "postgres://prod-secret", isSet: true },
      STAGING: { value: "postgres://stg-secret", isSet: true },
      DEVELOPMENT: { value: "", isSet: false },
    },
    rotationAgeDays: 100, // Overdue
    lastRotatedBy: "dev@corp.com",
    securityTier: "RESTRICTED" as const,
  },
];

describe("SecretVaultAccessMatrix", () => {
  it("passes axe accessibility tests with zero violations", async () => {
    const { container } = render(<SecretVaultAccessMatrix secrets={mockSecrets} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders secret key name and rotation warning", () => {
    render(<SecretVaultAccessMatrix secrets={mockSecrets} />);
    expect(
      screen.getByText("Multi-Environment Secret Vault & Key Rotation Matrix")
    ).toBeInTheDocument();
    expect(screen.getByText("DATABASE_URL")).toBeInTheDocument();
    expect(
      screen.getByText(/1 SECRETS REQUIRE ROTATION/i)
    ).toBeInTheDocument();
  });

  it("reveals masked secret on Show click and masks on Hide click", () => {
    render(<SecretVaultAccessMatrix secrets={mockSecrets} />);
    const revealBtn = screen.getByLabelText("Reveal DATABASE_URL on PRODUCTION");

    // Initially masked (both Prod and Staging)
    expect(screen.getAllByText("••••••••••••").length).toBeGreaterThanOrEqual(2);

    fireEvent.click(revealBtn);
    expect(screen.getByText("postgres://prod-secret")).toBeInTheDocument();

    const hideBtn = screen.getByLabelText("Mask DATABASE_URL on PRODUCTION");
    fireEvent.click(hideBtn);
    expect(screen.getAllByText("••••••••••••").length).toBeGreaterThanOrEqual(2);
  });

  it("triggers onRotateSecret callback", () => {
    const handleRotate = vi.fn();
    render(
      <SecretVaultAccessMatrix
        secrets={mockSecrets}
        onRotateSecret={handleRotate}
      />
    );

    const rotateBtn = screen.getByLabelText("Trigger key rotation for DATABASE_URL");
    fireEvent.click(rotateBtn);

    expect(handleRotate).toHaveBeenCalledWith("sec_1", "PRODUCTION");
  });
});
