import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { InlineEdit } from "./inline-edit";

describe("InlineEdit Component", () => {
  it("renders display mode and enters edit mode on click", () => {
    const onSave = vi.fn();
    render(<InlineEdit label="Project Name" value="Apollo Project" onSave={onSave} />);

    expect(screen.getByText("Apollo Project")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Project Name: Apollo Project/i }));

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Apollo Project");
  });

  it("saves changes when clicking check button or pressing Enter", () => {
    const onSave = vi.fn();
    render(<InlineEdit label="Project" value="Old Name" onSave={onSave} />);

    fireEvent.click(screen.getByRole("button", { name: /Project: Old Name/i }));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "New Name" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSave).toHaveBeenCalledWith("New Name");
  });

  it("cancels changes when clicking cancel or pressing Escape", () => {
    const onSave = vi.fn();
    render(<InlineEdit label="Project" value="Original" onSave={onSave} />);

    fireEvent.click(screen.getByRole("button", { name: /Project: Original/i }));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Changed" } });
    fireEvent.keyDown(input, { key: "Escape" });

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText("Original")).toBeInTheDocument();
  });

  it("has zero accessibility violations in display mode", async () => {
    const { container } = render(
      <InlineEdit label="Username" value="admin_user" onSave={() => {}} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has zero accessibility violations in edit mode", async () => {
    const { container } = render(
      <InlineEdit label="Username" value="admin_user" onSave={() => {}} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Username: admin_user/i }));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
