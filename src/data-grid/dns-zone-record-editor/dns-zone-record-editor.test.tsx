import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  DnsZoneRecordEditor,
  DnsZoneRecord,
} from "./dns-zone-record-editor";

const mockRecords: DnsZoneRecord[] = [
  {
    id: "rec-1",
    type: "A",
    name: "api",
    content: "198.51.100.15",
    ttl: 300,
    proxied: true,
    status: "active",
  },
  {
    id: "rec-2",
    type: "TXT",
    name: "@",
    content: "v=spf1 include:_spf.google.com ~all",
    ttl: 3600,
    status: "active",
  },
];

describe("DnsZoneRecordEditor", () => {
  it("renders zone records and search filter", () => {
    render(<DnsZoneRecordEditor zoneName="unierp.io" records={mockRecords} />);
    expect(screen.getByText("DNS Records: unierp.io")).toBeInTheDocument();
    expect(screen.getByText("api")).toBeInTheDocument();
    expect(screen.getByText("198.51.100.15")).toBeInTheDocument();
  });

  it("filters records by type button", () => {
    render(<DnsZoneRecordEditor zoneName="unierp.io" records={mockRecords} />);
    const txtFilterBtn = screen.getByRole("button", { name: "TXT" });
    fireEvent.click(txtFilterBtn);

    expect(screen.queryByText("198.51.100.15")).not.toBeInTheDocument();
    expect(
      screen.getByText("v=spf1 include:_spf.google.com ~all")
    ).toBeInTheDocument();
  });

  it("toggles proxy status when proxy button clicked", () => {
    const onToggleProxy = vi.fn();
    render(
      <DnsZoneRecordEditor
        zoneName="unierp.io"
        records={mockRecords}
        onToggleProxy={onToggleProxy}
      />
    );

    const proxyBtn = screen.getByRole("button", { name: /Proxied/i });
    fireEvent.click(proxyBtn);
    expect(onToggleProxy).toHaveBeenCalledWith("rec-1", false);
  });

  it("passes automated accessibility (axe) checks", async () => {
    const { container } = render(
      <DnsZoneRecordEditor zoneName="unierp.io" records={mockRecords} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
