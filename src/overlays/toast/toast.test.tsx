import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ToastProvider, useToast } from "./toast";

const Consumer = () => {
  const { success } = useToast();
  return <button onClick={() => success("Saved", "Record committed")}>Trigger</button>;
};

describe("Toast Primitive", () => {
  it("pushes and renders toast notification", () => {
    render(
      <ToastProvider>
        <Consumer />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Trigger"));
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Record committed")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ToastProvider>
        <div>Content</div>
      </ToastProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
