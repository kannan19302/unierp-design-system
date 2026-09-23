import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
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

  it("saves changes when pressing Enter", async () => {
    const onSave = vi.fn();
    render(<InlineEdit label="Project" value="Old Name" onSave={onSave} />);

    fireEvent.click(screen.getByRole("button", { name: /Project: Old Name/i }));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "New Name" } });
    await act(async () => {
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(onSave).toHaveBeenCalledWith("New Name");
  });

  it("saves changes when clicking check button", async () => {
    const onSave = vi.fn();
    render(<InlineEdit label="Project" value="Old Name" onSave={onSave} />);

    fireEvent.click(screen.getByRole("button", { name: /Project: Old Name/i }));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Saved via Button" } });
    const saveBtn = screen.getByRole("button", { name: "Save changes" });
    await act(async () => {
      fireEvent.click(saveBtn);
    });

    expect(onSave).toHaveBeenCalledWith("Saved via Button");
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

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(<InlineEdit density="compact" value="Compact Value" onSave={() => {}} />);
    expect(container.firstChild).toHaveAttribute("data-density", "compact");

    rerender(<InlineEdit density="ultra-compact" value="Ultra Value" onSave={() => {}} />);
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(<InlineEdit density="comfortable" value="Comfortable Value" onSave={() => {}} />);
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("displays validation error message when validator fails", () => {
    render(
      <InlineEdit
        label="Project"
        value="Valid"
        onSave={() => {}}
        validate={(v) => (v === "Invalid" ? "Must be valid" : null)}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Project: Valid/i }));
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Invalid" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.getByRole("alert")).toHaveTextContent("Must be valid");
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

  it("isolates stable unique IDs across multiple identical instances on the same page", () => {
    render(
      <div>
        <InlineEdit label="Project" value="First" onSave={() => {}} />
        <InlineEdit label="Project" value="Second" onSave={() => {}} />
      </div>
    );

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0].id).toBeTruthy();
    expect(inputs[1].id).toBeTruthy();
    expect(inputs[0].id).not.toBe(inputs[1].id);
  });
});
