import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ProgressHUD } from "./progress-hud";

describe("ProgressHUD Data Display", () => {
  const items = [
    { key: "1", label: "Task 1", isCompleted: true },
    { key: "2", label: "Task 2", isCompleted: false, actionLabel: "Do Task" },
  ];

  it("renders progress percentage and title", () => {
    render(<ProgressHUD percentComplete={50} items={items} title="Setup Checklist" />);
    expect(screen.getByText("Setup Checklist")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ProgressHUD percentComplete={50} items={items} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
