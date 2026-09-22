import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { EnvironmentBanner } from "./environment-banner";

describe("EnvironmentBanner Platform Component", () => {
  it("renders development banner by default", () => {
    render(<EnvironmentBanner environment="development" />);
    expect(screen.getByText(/DEV ENVIRONMENT/i)).toBeInTheDocument();
  });

  it("renders staging environment banner", () => {
    render(<EnvironmentBanner environment="staging" />);
    expect(screen.getByText(/STAGING ENVIRONMENT/i)).toBeInTheDocument();
  });

  it("hides production environment banner unless forceShow is true", () => {
    const { container } = render(<EnvironmentBanner environment="production" />);
    expect(container.firstChild).toBeNull();
  });

  it("shows production environment banner when forceShow is true", () => {
    render(<EnvironmentBanner environment="production" forceShow />);
    expect(screen.getByText(/PRODUCTION ENVIRONMENT/i)).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<EnvironmentBanner environment="staging" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
