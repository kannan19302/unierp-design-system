import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SplitMasterDetailTemplate } from "./split-master-detail-template";

describe("SplitMasterDetailTemplate Component", () => {
  it("renders master and detail panes", () => {
    render(
      <SplitMasterDetailTemplate
        masterTitle="Accounts"
        masterList={<div>Account Item 1</div>}
        detailBody={<div>Detail Pane Content</div>}
      />
    );
    expect(screen.getByRole("region", { name: /master detail workspace/i })).toBeInTheDocument();
    expect(screen.getByText("Accounts")).toBeInTheDocument();
    expect(screen.getByText("Account Item 1")).toBeInTheDocument();
    expect(screen.getByText("Detail Pane Content")).toBeInTheDocument();
  });

  it("renders empty state message when isDetailEmpty is true", () => {
    render(
      <SplitMasterDetailTemplate
        isDetailEmpty={true}
        emptyDetailMessage="Nothing selected"
      />
    );
    expect(screen.getByText("Nothing selected")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SplitMasterDetailTemplate
        masterTitle="Accessible Pane"
        masterList={<div>Item</div>}
        detailBody={<div>Body</div>}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
