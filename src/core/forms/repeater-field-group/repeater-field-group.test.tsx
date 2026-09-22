import React, { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { RepeaterFieldGroup } from "./repeater-field-group";

const fields = ["Description", "Qty", "Unit Price", "Amount"];

describe("RepeaterFieldGroup", () => {
  it("renders without crashing", () => {
    render(<RepeaterFieldGroup label="Line Items" fields={fields} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("forwards ref correctly to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<RepeaterFieldGroup ref={ref} label="Line Items" fields={fields} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <RepeaterFieldGroup label="Line Items" fields={fields} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
