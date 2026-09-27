import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ToastProvider, useToast, Toast } from "./toast";

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

  it("renders data-slot anatomy on static Toast component", () => {
    render(
      <Toast
        variant="warning"
        density="compact"
        title="Warning Toast"
        description="Check ledger accounts"
        onDismiss={() => {}}
      />
    );
    const toast = document.querySelector('[data-slot="toast"]');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveAttribute("data-variant", "warning");
    expect(toast).toHaveAttribute("data-density", "compact");
    expect(document.querySelector('[data-slot="toast-icon"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="toast-content"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="toast-title"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="toast-description"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="toast-dismiss"]')).toBeInTheDocument();
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
