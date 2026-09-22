import React, { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { AlertThresholdConfigurator } from "./alert-threshold-configurator";

describe("AlertThresholdConfigurator", () => {
  it("renders without crashing", () => {
    render(
      <AlertThresholdConfigurator
        metric="CPU Usage"
        warningThreshold={70}
        criticalThreshold={90}
        unit="%"
        onSave={() => {}}
      />
    );
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("forwards ref correctly to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AlertThresholdConfigurator
        ref={ref}
        metric="CPU Usage"
        warningThreshold={70}
        criticalThreshold={90}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <AlertThresholdConfigurator
        metric="CPU Usage"
        warningThreshold={70}
        criticalThreshold={90}
        unit="%"
        onSave={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
