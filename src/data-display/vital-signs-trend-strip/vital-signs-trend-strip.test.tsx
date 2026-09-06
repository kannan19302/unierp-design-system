import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { VitalSignsTrendStrip, VitalMetricSeries } from "./vital-signs-trend-strip";

const TEST_SERIES: VitalMetricSeries[] = [
  {
    id: "hr",
    label: "Heart Rate",
    code: "HR",
    unit: "bpm",
    currentValue: 72,
    normalMin: 60,
    normalMax: 100,
    status: "normal",
    dataPoints: [{ time: "1", value: 70 }, { time: "2", value: 74 }],
  },
  {
    id: "spo2",
    label: "Oxygen Saturation",
    code: "SpO2",
    unit: "%",
    currentValue: 88,
    normalMin: 95,
    normalMax: 100,
    status: "critical",
    alarmNote: "Hypoxemic warning",
    dataPoints: [{ time: "1", value: 94 }, { time: "2", value: 88 }],
  },
];

describe("VitalSignsTrendStrip", () => {
  it("renders vital telemetry channels and has zero accessibility violations", async () => {
    const { container } = render(
      <VitalSignsTrendStrip
        subjectTitle="ICU Telemetry Monitored Feed"
        series={TEST_SERIES}
      />
    );

    expect(screen.getByText("ICU Telemetry Monitored Feed")).toBeInTheDocument();
    expect(screen.getByText("HR")).toBeInTheDocument();
    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByText("SpO2")).toBeInTheDocument();
    expect(screen.getByText("88")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles alarm acknowledgement click", () => {
    const handleAck = vi.fn();
    render(
      <VitalSignsTrendStrip
        series={TEST_SERIES}
        onAcknowledgeAlarm={handleAck}
      />
    );

    const ackBtn = screen.getByRole("button", { name: /ACK ALARM/i });
    fireEvent.click(ackBtn);

    expect(handleAck).toHaveBeenCalledWith("spo2");
  });

  it("selects channel on click and keyboard interaction", () => {
    render(
      <VitalSignsTrendStrip
        series={TEST_SERIES}
      />
    );

    const hrCard = screen.getByRole("region", { name: /Heart Rate \(HR\)/i });
    fireEvent.click(hrCard);
    expect(hrCard.className).toMatch(/channelSelected/);

    const spo2Card = screen.getByRole("region", { name: /Oxygen Saturation \(SpO2\)/i });
    fireEvent.keyDown(spo2Card, { key: "Enter" });
    expect(spo2Card.className).toMatch(/channelSelected/);
  });
});
