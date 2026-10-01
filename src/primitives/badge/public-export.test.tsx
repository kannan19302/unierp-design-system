import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "../..";

describe("public root exports", () => {
  it("exports StatusBadge through the supported package root", () => {
    render(<StatusBadge status="ACTIVE" />);
    expect(screen.getByText("ACTIVE")).toBeTruthy();
  });
});
