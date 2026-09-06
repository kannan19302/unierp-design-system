import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { AlertThresholdConfigurator } from "./alert-threshold-configurator";

const defaultProps = {} as any;

describe("AlertThresholdConfigurator", () => {
  it("renders without crashing", () => {
    render(<AlertThresholdConfigurator {...defaultProps} metric="CPU Usage" warningThreshold={70} criticalThreshold={90} unit="%" onSave={() => {}} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<AlertThresholdConfigurator {...defaultProps} metric="CPU Usage" warningThreshold={70} criticalThreshold={90} unit="%" onSave={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
