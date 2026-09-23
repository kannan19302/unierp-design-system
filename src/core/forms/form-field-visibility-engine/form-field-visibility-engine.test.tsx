import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { FormFieldVisibilityEngine } from "./form-field-visibility-engine";

const defaultProps = {} as any;

describe("FormFieldVisibilityEngine", () => {
  it("renders without crashing", () => {
    render(<FormFieldVisibilityEngine {...defaultProps} fields={[]} values={{}}>{() => <div />}</FormFieldVisibilityEngine>);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FormFieldVisibilityEngine {...defaultProps} fields={[]} values={{}}>{() => <div />}</FormFieldVisibilityEngine>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
