import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { StrataBar } from "./strata-bar";

describe("StrataBar", () => {
  it("renders segments and terminal correctly", () => {
    const { getByText } = render(
      <StrataBar segments={["acme", "finance", "INV-100"]} />,
    );
    expect(getByText("acme")).toBeDefined();
    expect(getByText("INV-100")).toBeDefined();
  });

  it("renders status pill and action", () => {
    const { getByText } = render(
      <StrataBar
        segments={["acme", "finance"]}
        state={{ kind: "success", label: "Approved" }}
        action={<button>Post</button>}
      />,
    );
    expect(getByText("Approved")).toBeDefined();
    expect(getByText("Post")).toBeDefined();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <StrataBar
        segments={["acme", "finance", "INV-100"]}
        state={{ kind: "info", label: "Open" }}
        action={<button>Review</button>}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
