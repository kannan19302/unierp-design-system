import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { PublishDiffDialog, type PublishChange } from "./publish-diff-dialog";

const MOCK_CHANGES: PublishChange[] = [
  { id: "c1", kind: "added", what: "New Checkout Button" },
  { id: "c2", kind: "changed", what: "Tax Calculation Rule", detail: "Updated VAT to 20%" },
];

describe("PublishDiffDialog Primitive", () => {
  it("renders target environment, diff items, and handles publish", () => {
    const onPublish = vi.fn();
    render(
      <PublishDiffDialog
        open={true}
        onClose={() => {}}
        name="Storefront Page"
        environment="Production (EU-Central)"
        rollbackTo="v1.2.4"
        changes={MOCK_CHANGES}
        onPublish={onPublish}
      />
    );

    expect(screen.getByText("Publish Storefront Page")).toBeInTheDocument();
    expect(screen.getByText("Production (EU-Central)")).toBeInTheDocument();
    expect(screen.getByText("New Checkout Button")).toBeInTheDocument();
    expect(screen.getByText("Tax Calculation Rule")).toBeInTheDocument();
    expect(screen.getByText(/Updated VAT to 20%/)).toBeInTheDocument();

    const publishBtn = screen.getByRole("button", { name: /Publish to Production/i });
    fireEvent.click(publishBtn);
    expect(onPublish).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <PublishDiffDialog
        open={true}
        onClose={() => {}}
        name="Storefront Page"
        environment="Production"
        changes={MOCK_CHANGES}
        onPublish={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
