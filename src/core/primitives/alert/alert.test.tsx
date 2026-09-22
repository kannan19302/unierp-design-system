import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Alert } from "./alert";
import { InlineMessage } from "./inline-message";

describe("Alert Primitive", () => {
  it("renders alert role with title and message", () => {
    render(
      <Alert variant="info" title="Important Notice">
        Notice contents
      </Alert>
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Important Notice")).toBeInTheDocument();
    expect(screen.getByText("Notice contents")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <Alert variant="success" title="Success">
        Action completed
      </Alert>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("InlineMessage Primitive", () => {
  it("renders inline message", () => {
    render(<InlineMessage variant="warning">Warning hint</InlineMessage>);
    expect(screen.getByText("Warning hint")).toBeInTheDocument();
  });
});
