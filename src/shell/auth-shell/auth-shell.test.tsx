import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AuthShell } from "./auth-shell";


describe("AuthShell", () => {
  it("renders the login variant with correct heading", () => {
    render(<AuthShell variant="login"><form>Login form</form></AuthShell>);
    expect(screen.getByText("Welcome back")).toBeDefined();
    expect(screen.getByText("Sign in to your account to continue")).toBeDefined();
    expect(screen.getByText("Login form")).toBeDefined();
  });

  it("renders the register variant with correct heading", () => {
    render(<AuthShell variant="register"><form>Register form</form></AuthShell>);
    expect(screen.getByText("Create your account")).toBeDefined();
  });

  it("renders tenant name when provided", () => {
    render(<AuthShell variant="login" tenantName="Acme Corp"><div /></AuthShell>);
    expect(screen.getByText("Acme Corp")).toBeDefined();
  });

  it("renders footer when provided", () => {
    render(
      <AuthShell variant="login" footer={<span>Legal terms</span>}>
        <div />
      </AuthShell>,
    );
    expect(screen.getByText("Legal terms")).toBeDefined();
  });

  it("renders illustration panel when provided", () => {
    render(
      <AuthShell variant="login" illustration={<div>Brand art</div>}>
        <div />
      </AuthShell>,
    );
    expect(screen.getByText("Brand art")).toBeDefined();
  });

  it("has correct aria label on main", () => {
    render(<AuthShell variant="login"><div /></AuthShell>);
    expect(screen.getByRole("main")).toBeDefined();
    expect(screen.getByLabelText("Authentication")).toBeDefined();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <AuthShell variant="login" tenantName="Test Org">
        <form aria-label="Login form">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" />
          <button type="submit">Sign in</button>
        </form>
      </AuthShell>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
