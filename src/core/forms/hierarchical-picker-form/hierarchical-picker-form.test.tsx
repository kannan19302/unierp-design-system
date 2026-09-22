import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { HierarchicalPickerForm } from "./hierarchical-picker-form";

const testLevels = [
  {
    label: "Department",
    options: { _root: ["Engineering", "Finance"] },
  },
  {
    label: "Team",
    options: {
      Engineering: ["DevOps", "Frontend"],
      Finance: ["AP", "Treasury"],
    },
  },
];

describe("HierarchicalPickerForm", () => {
  it("progressively cascades selections across levels", () => {
    const onChange = vi.fn();
    render(
      <HierarchicalPickerForm
        levels={testLevels}
        onChange={onChange}
        title="Department Hierarchy"
      />
    );

    expect(screen.getByRole("group", { name: "Department Hierarchy" })).toBeInTheDocument();
    expect(screen.getByLabelText("Department")).toBeInTheDocument();
    expect(screen.queryByLabelText("Team")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Department"), {
      target: { value: "Engineering" },
    });

    expect(onChange).toHaveBeenCalledWith(["Engineering"]);
    expect(screen.getByLabelText("Team")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Team"), {
      target: { value: "DevOps" },
    });

    expect(onChange).toHaveBeenCalledWith(["Engineering", "DevOps"]);
    expect(screen.getByText("Engineering › DevOps")).toBeInTheDocument();
  });

  it("forwards ref correctly to the container group", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<HierarchicalPickerForm ref={ref} levels={testLevels} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "group");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <HierarchicalPickerForm
        levels={testLevels}
        initialPath={["Engineering", "DevOps"]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
