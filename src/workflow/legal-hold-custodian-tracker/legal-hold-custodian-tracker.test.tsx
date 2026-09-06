import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  LegalHoldCustodianTracker,
  LegalMatterInfo,
  LegalHoldCustodian,
} from "./legal-hold-custodian-tracker";

const sampleMatter: LegalMatterInfo = {
  matterNumber: "MAT-2026-881",
  matterName: "FTC Regulatory Inquiry",
  issuingCounsel: "Cravath, Swaine & Moore LLP",
  effectiveDate: "2026-03-01",
};

const sampleCustodians: LegalHoldCustodian[] = [
  {
    id: "cust_01",
    name: "Dr. Julian Vance",
    department: "Product Engineering",
    email: "jvance@enterprise.com",
    acknowledgmentStatus: "ACKNOWLEDGED",
    acknowledgedAt: "2026-03-02 09:14 EST",
    dataSourcesPreserved: ["Exchange Online"],
    silentPreservationActive: true,
  },
  {
    id: "cust_02",
    name: "Rachel Montgomery",
    department: "Global Sales",
    email: "rmontgomery@enterprise.com",
    acknowledgmentStatus: "PENDING",
    dataSourcesPreserved: ["Salesforce CRM"],
    silentPreservationActive: true,
  },
];

describe("LegalHoldCustodianTracker", () => {
  it("renders legal matter header and custodians truthfully", () => {
    render(
      <LegalHoldCustodianTracker matter={sampleMatter} custodians={sampleCustodians} />
    );
    expect(
      screen.getByText(/Legal Hold Notice Custodian Compliance & Preservation Log/i)
    ).toBeInTheDocument();
    expect(screen.getByText("MAT-2026-881")).toBeInTheDocument();
    expect(screen.getByText("Dr. Julian Vance")).toBeInTheDocument();
    expect(screen.getByText("Rachel Montgomery")).toBeInTheDocument();
    expect(screen.getByText("jvance@enterprise.com")).toBeInTheDocument();
  });

  it("handles filtering by custodian acknowledgment status", () => {
    render(
      <LegalHoldCustodianTracker matter={sampleMatter} custodians={sampleCustodians} />
    );
    const filterSelect = screen.getByLabelText(/Filter Status:/i);
    fireEvent.change(filterSelect, { target: { value: "PENDING" } });

    expect(screen.getByText("Rachel Montgomery")).toBeInTheDocument();
    expect(screen.queryByText("Dr. Julian Vance")).not.toBeInTheDocument();
  });

  it("handles sending escalation reminder", () => {
    const handleEscalate = vi.fn();
    render(
      <LegalHoldCustodianTracker
        matter={sampleMatter}
        custodians={sampleCustodians}
        onSendEscalationReminder={handleEscalate}
      />
    );

    const remindBtn = screen.getByRole("button", {
      name: "Send escalation notice to Rachel Montgomery",
    });
    fireEvent.click(remindBtn);

    expect(handleEscalate).toHaveBeenCalledWith("cust_02");
    expect(screen.getByText("Escalation Sent")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <LegalHoldCustodianTracker matter={sampleMatter} custodians={sampleCustodians} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
