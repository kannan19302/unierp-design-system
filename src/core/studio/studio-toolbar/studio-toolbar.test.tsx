import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { StudioToolbar } from "./studio-toolbar";

describe("StudioToolbar Primitive", () => {
  it("renders 5 fixed verbs and triggers actions", () => {
    const onPublish = vi.fn();
    const onValidate = vi.fn();
    render(
      <StudioToolbar
        name="Checkout Flow"
        kind="Workflow"
        dirty={true}
        version="v2.1"
        problemCount={1}
        validate={{ onAction: onValidate }}
        publish={{ onAction: onPublish }}
      />
    );

    expect(screen.getByText("Checkout Flow")).toBeInTheDocument();
    expect(screen.getByText("Workflow")).toBeInTheDocument();
    expect(screen.getByText("Unsaved")).toBeInTheDocument();
    expect(screen.getByText("v2.1")).toBeInTheDocument();

    const publishBtn = screen.getByRole("button", { name: /Publish/i });
    fireEvent.click(publishBtn);
    expect(onPublish).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <StudioToolbar
        name="Page Designer"
        validate={{ onAction: () => {} }}
        publish={{ onAction: () => {} }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
