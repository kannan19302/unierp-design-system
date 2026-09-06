import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ProgressNotification } from "./progress-notification";

const defaultProps = {} as any;

describe("ProgressNotification", () => {
  it("renders without crashing", () => {
    render(<ProgressNotification {...defaultProps} title="Deploying v3.2.1 to Production" progress={67} status="running" message="Building container images..." onCancel={() => {}} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ProgressNotification {...defaultProps} title="Deploying v3.2.1 to Production" progress={67} status="running" message="Building container images..." onCancel={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
