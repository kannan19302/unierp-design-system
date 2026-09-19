import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { WysiwygCanvas } from "./wysiwyg-canvas";

describe("WysiwygCanvas Component", () => {
  it("renders canvas with responsive viewport frame and children", () => {
    render(
      <WysiwygCanvas label="Test Canvas" deviceMode="tablet">
        <div data-testid="page-element">Hero Block</div>
      </WysiwygCanvas>
    );

    expect(screen.getByRole("region", { name: "Test Canvas" })).toBeInTheDocument();
    expect(screen.getByTestId("page-element")).toBeInTheDocument();
  });

  it("renders selection overlay, handles, and quick action buttons when element is selected", () => {
    const onDuplicate = vi.fn();
    const onDelete = vi.fn();

    render(
      <WysiwygCanvas
        label="Test Canvas"
        selectedElement={{ id: "hero-1", name: "Hero Banner", width: 1200, height: 400 }}
        onDuplicateElement={onDuplicate}
        onDeleteElement={onDelete}
      >
        <div>Content</div>
      </WysiwygCanvas>
    );

    expect(screen.getByText("Hero Banner")).toBeInTheDocument();
    expect(screen.getByText("1200 × 400")).toBeInTheDocument();

    const dupBtn = screen.getByRole("button", { name: "Duplicate element" });
    fireEvent.click(dupBtn);
    expect(onDuplicate).toHaveBeenCalledWith("hero-1");

    const delBtn = screen.getByRole("button", { name: "Delete element" });
    fireEvent.click(delBtn);
    expect(onDelete).toHaveBeenCalledWith("hero-1");
  });

  it("handles Escape key to deselect element and Delete key to remove element", () => {
    const onSelect = vi.fn();
    const onDelete = vi.fn();

    render(
      <WysiwygCanvas
        label="Test Canvas"
        selectedElement={{ id: "card-1", name: "Card" }}
        onSelectElement={onSelect}
        onDeleteElement={onDelete}
      >
        <div>Content</div>
      </WysiwygCanvas>
    );

    const canvas = screen.getByRole("region", { name: "Test Canvas" });
    fireEvent.keyDown(canvas, { key: "Escape" });
    expect(onSelect).toHaveBeenCalledWith(null);

    fireEvent.keyDown(canvas, { key: "Delete" });
    expect(onDelete).toHaveBeenCalledWith("card-1");
  });

  it("forwards ref to outer container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<WysiwygCanvas ref={ref} label="Ref Canvas"><div>Content</div></WysiwygCanvas>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <WysiwygCanvas
        label="Accessible Canvas"
        selectedElement={{ id: "hero-1", name: "Hero" }}
      >
        <div>Content</div>
      </WysiwygCanvas>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
