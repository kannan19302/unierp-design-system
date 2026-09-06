import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { RestApiClientWorkbench } from "./rest-api-client-workbench";

describe("RestApiClientWorkbench", () => {
  it("renders address bar, method selector, and response status truthfully", () => {
    render(<RestApiClientWorkbench />);
    expect(
      screen.getByText(/REST API Client & Payload Dispatch Console/i)
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("https://api.enterprise.unierp.com/v1/ledger/journal-entries")
    ).toBeInTheDocument();
    expect(screen.getByText("200 OK")).toBeInTheDocument();
    expect(screen.getByText("⏱ 42 ms")).toBeInTheDocument();
  });

  it("handles switching request tabs and sending requests", () => {
    const handleSend = vi.fn();
    render(<RestApiClientWorkbench onSendRequest={handleSend} />);

    const headersTab = screen.getByRole("tab", { name: /Headers/i });
    fireEvent.click(headersTab);
    expect(screen.getByText("Authorization")).toBeInTheDocument();
    expect(screen.getByText("X-Tenant-Id")).toBeInTheDocument();

    const sendBtn = screen.getByRole("button", { name: /Send HTTP request/i });
    fireEvent.click(sendBtn);

    expect(handleSend).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<RestApiClientWorkbench />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
