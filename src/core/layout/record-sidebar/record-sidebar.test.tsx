import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { RecordSidebar } from "./record-sidebar";

describe("RecordSidebar Primitive", () => {
  it("renders sidebar with title and body", () => {
    render(
      <RecordSidebar title="Record Details">
        <p>Sidebar content</p>
      </RecordSidebar>
    );
    expect(screen.getByRole("complementary", { name: "Record Details" })).toBeInTheDocument();
    expect(screen.getByText("Sidebar content")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <RecordSidebar title="Accessible Sidebar">
        <p>Content</p>
      </RecordSidebar>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
