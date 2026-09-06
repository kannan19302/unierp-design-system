import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { RealTimeMetricsBoard } from "./real-time-metrics-board";

const defaultProps = {} as any;

describe("RealTimeMetricsBoard", () => {
  it("renders without crashing", () => {
    render(<RealTimeMetricsBoard {...defaultProps} widgets={[{ id: '1', label: 'CPU Usage', value: '67%', status: 'normal' }, { id: '2', label: 'Memory', value: '82%', status: 'warning' }, { id: '3', label: 'Requests/s', value: '1,247', unit: 'req/s' }, { id: '4', label: 'Error Rate', value: '0.12%', status: 'normal' }, { id: '5', label: 'P99 Latency', value: '245', unit: 'ms', status: 'warning' }, { id: '6', label: 'Active Users', value: '3,891' }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<RealTimeMetricsBoard {...defaultProps} widgets={[{ id: '1', label: 'CPU Usage', value: '67%', status: 'normal' }, { id: '2', label: 'Memory', value: '82%', status: 'warning' }, { id: '3', label: 'Requests/s', value: '1,247', unit: 'req/s' }, { id: '4', label: 'Error Rate', value: '0.12%', status: 'normal' }, { id: '5', label: 'P99 Latency', value: '245', unit: 'ms', status: 'warning' }, { id: '6', label: 'Active Users', value: '3,891' }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
