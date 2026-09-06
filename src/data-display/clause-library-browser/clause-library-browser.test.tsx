import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  ClauseLibraryBrowser,
  ClauseCategory,
} from "./clause-library-browser";

const sampleCategories: ClauseCategory[] = [
  {
    id: "cat-indemnity",
    categoryName: "Indemnification & Defense",
    variants: [
      {
        id: "indem-std",
        variantTitle: "Mutual Standard Indemnification",
        riskLevel: "standard",
        clauseText: "Each party agrees to defend and indemnify the other.",
        guidanceNotes: "Standard enterprise language.",
      },
      {
        id: "indem-ip-only",
        variantTitle: "IP Infringement Sole Remedy",
        riskLevel: "moderate_risk",
        clauseText: "Vendor shall defend and indemnify Customer against IP claims.",
        guidanceNotes: "Use only when customer refuses mutual language.",
      },
    ],
  },
];

describe("ClauseLibraryBrowser", () => {
  it("renders clause categories, variants, and clause language", () => {
    render(
      <ClauseLibraryBrowser
        contractContext="Master Agreement"
        categories={sampleCategories}
      />
    );

    expect(screen.getByText("Enterprise Clause Library Browser")).toBeInTheDocument();
    expect(screen.getByText("Indemnification & Defense")).toBeInTheDocument();
    expect(screen.getAllByText("Mutual Standard Indemnification").length).toBeGreaterThan(0);
    expect(screen.getByText("Each party agrees to defend and indemnify the other.")).toBeInTheDocument();

  });

  it("handles variant selection and insert callback", () => {
    const onInsert = vi.fn();
    render(
      <ClauseLibraryBrowser
        categories={sampleCategories}
        onInsertClause={onInsert}
      />
    );

    const ipVariantCard = screen.getByRole("button", { name: /Select IP Infringement Sole Remedy/i });
    fireEvent.click(ipVariantCard);

    expect(screen.getByText("Vendor shall defend and indemnify Customer against IP claims.")).toBeInTheDocument();

    const insertBtn = screen.getByRole("button", { name: /Insert into Contract/i });
    fireEvent.click(insertBtn);
    expect(onInsert).toHaveBeenCalledWith(sampleCategories[0].variants[1]);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ClauseLibraryBrowser
        categories={sampleCategories}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
