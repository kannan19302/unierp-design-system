import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { VisuallyHidden } from "./visually-hidden";

describe("VisuallyHidden", () => {
  it("renders screen-reader text in DOM", () => {
    render(<VisuallyHidden>Assistive label</VisuallyHidden>);
    expect(screen.getByText("Assistive label")).toBeInTheDocument();
  });
});
