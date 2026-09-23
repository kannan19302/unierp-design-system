import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ToastProvider, useToast } from "./toast";

const ToastTrigger = () => {
  const toast = useToast();
  return (
    <div>
      <button onClick={() => toast.success("Saved!", "Record updated successfully")}>
        Trigger Success
      </button>
      <button onClick={() => toast.error("Failed!", "Something went wrong")}>
        Trigger Error
      </button>
    </div>
  );
};

describe("Notifications Toast Primitive", () => {
  it("displays toast on trigger and dismisses it", () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Trigger Success"));
    expect(screen.getByText("Saved!")).toBeInTheDocument();
    expect(screen.getByText("Record updated successfully")).toBeInTheDocument();

    const dismissBtn = screen.getByRole("button", { name: /dismiss notification/i });
    fireEvent.click(dismissBtn);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Trigger Success"));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
