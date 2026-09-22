import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ArtifactAddress, formatAddress } from "./artifact-address";

describe("ArtifactAddress Primitive", () => {
  it("formats address correctly", () => {
    const formatted = formatAddress({
      tenant: "acme",
      scope: "app",
      project: "hr",
      builder: "forms",
      artifact: "onboard",
      version: "1.0",
    });
    expect(formatted).toBe("acme/apps/hr/forms/onboard@1.0");
  });

  it("renders em dash when project is null", () => {
    render(<ArtifactAddress scope="library" project={null} builder="forms" />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("forwards ref to root span element", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<ArtifactAddress ref={ref} scope="app" project="erp" artifact="ledger" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ArtifactAddress scope="app" project="erp" artifact="general-ledger" copyable />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
