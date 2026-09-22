import React, { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { InlineEditableRecord } from "./inline-editable-record";

const sampleFields = [
  { key: "name", label: "Company Name", value: "Acme Corp", editable: true },
  { key: "email", label: "Contact Email", value: "billing@acme.com", editable: true },
  { key: "plan", label: "Plan", value: "Enterprise", editable: true },
  { key: "id", label: "Account ID", value: "ACC-00472", editable: false },
];

describe("InlineEditableRecord", () => {
  it("renders without crashing", () => {
    render(<InlineEditableRecord fields={sampleFields} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("forwards ref correctly to the container div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<InlineEditableRecord ref={ref} fields={sampleFields} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<InlineEditableRecord fields={sampleFields} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
