import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Select } from "./select";

describe("Select", () => {
  it("renders with options", () => {
    render(
      <Select
        label="Test Select"
        options={[{ label: "Option 1", value: "1" }]}
      />
    );
    expect(screen.getByLabelText("Test Select")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
