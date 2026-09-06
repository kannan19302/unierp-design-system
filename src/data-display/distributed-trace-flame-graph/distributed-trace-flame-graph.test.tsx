import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import { DistributedTraceFlameGraph } from "./distributed-trace-flame-graph";

describe("DistributedTraceFlameGraph", () => {
  const sampleSpans = [
    {
      id: "span-root",
      serviceName: "api-gateway",
      operationName: "POST /v1/payouts",
      startTimeMs: 0,
      durationMs: 400,
      statusCode: "ok" as const,
      attributes: { "http.status": 200 },
    },
    {
      id: "span-db",
      parentId: "span-root",
      serviceName: "postgres",
      operationName: "SELECT * FROM accounts",
      startTimeMs: 50,
      durationMs: 150,
      statusCode: "ok" as const,
      attributes: { "db.rows": 10 },
    },
  ];

  const defaultProps = {
    traceId: "4bf92f3577b34da6a3ce929d0e0e4736",
    rootServiceName: "api-gateway",
    totalDurationMs: 400,
    spans: sampleSpans,
    onSelectSpan: vi.fn(),
  };

  it("renders trace header, spans, and inspector", () => {
    render(<DistributedTraceFlameGraph {...defaultProps} />);
    expect(
      screen.getByRole("heading", { name: /Distributed Trace Waterfall: api-gateway/i })
    ).toBeDefined();
    expect(screen.getByText("4bf92f3577b34da6a3ce929d0e0e4736")).toBeDefined();
    expect(screen.getAllByText("POST /v1/payouts").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("SELECT * FROM accounts")).toBeDefined();
  });

  it("selects span and displays attributes when clicked", () => {
    const handleSelect = vi.fn();
    render(<DistributedTraceFlameGraph {...defaultProps} onSelectSpan={handleSelect} />);
    const spanBtn = screen.getByRole("button", {
      name: /Select span postgres SELECT \* FROM accounts/i,
    });
    fireEvent.click(spanBtn);
    expect(handleSelect).toHaveBeenCalledWith("span-db");
    expect(screen.getByText("db.rows")).toBeDefined();
  });

  it("passes accessibility axe audit", async () => {
    const { container } = render(<DistributedTraceFlameGraph {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
