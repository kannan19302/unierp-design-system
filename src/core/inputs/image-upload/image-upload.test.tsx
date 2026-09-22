import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ImageUpload } from "./image-upload";

describe("ImageUpload Primitive", () => {
  it("renders upload callout text when no image is selected", () => {
    render(<ImageUpload />);
    expect(screen.getByText("Upload image")).toBeInTheDocument();
  });

  it("renders preview image when value is passed", () => {
    render(<ImageUpload value="https://example.com/avatar.png" />);
    expect(screen.getByAltText("Uploaded preview")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ImageUpload />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
