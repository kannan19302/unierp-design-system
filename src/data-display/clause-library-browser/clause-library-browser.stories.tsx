import type { Meta, StoryObj } from "@storybook/react";
import {
  ClauseLibraryBrowser,
  ClauseCategory,
} from "./clause-library-browser";

const mockCategories: ClauseCategory[] = [
  {
    id: "cat-indemnity",
    categoryName: "Indemnification & Defense",
    variants: [
      {
        id: "indem-std",
        variantTitle: "Mutual Standard Indemnification",
        riskLevel: "standard",
        clauseText:
          "Each party (the 'Indemnifying Party') agrees to defend, indemnify, and hold harmless the other party and its officers, directors, and employees from and against any and all third-party claims, damages, liabilities, and expenses arising out of or resulting from the Indemnifying Party's gross negligence, willful misconduct, or material breach of this Agreement.",
        guidanceNotes:
          "Standard enterprise mutual language. Acceptable in 95% of commercial procurement agreements without escalation.",
      },
      {
        id: "indem-ip-only",
        variantTitle: "IP Infringement Sole Remedy",
        riskLevel: "moderate_risk",
        approvalRequired: "Commercial Director",
        clauseText:
          "Vendor shall defend and indemnify Customer against any claim that the Software infringes any third-party patent, copyright, or trademark, provided Customer gives prompt written notice and sole control of defense.",
        guidanceNotes:
          "Use only when customer refuses mutual indemnification and insists on unilateral IP defense obligations.",
      },
    ],
  },
  {
    id: "cat-liability",
    categoryName: "Limitation of Liability",
    variants: [
      {
        id: "liab-std",
        variantTitle: "12-Month Fees Paid Cap",
        riskLevel: "standard",
        clauseText:
          "Except for breaches of confidentiality or gross negligence, neither party's aggregate liability under this Agreement shall exceed the total fees paid or payable by Customer in the twelve (12) months preceding the incident.",
        guidanceNotes:
          "Standard liability cap benchmark. Protects both vendor and customer from unbounded exposure.",
      },
      {
        id: "liab-2x",
        variantTitle: "2x Annual Contract Value Cap",
        riskLevel: "moderate_risk",
        approvalRequired: "VP of Legal & Finance",
        clauseText:
          "Neither party's total aggregate liability arising out of this Agreement shall exceed two times (2x) the total fees paid or payable by Customer during the contract term.",
        guidanceNotes:
          "Fallback concession for Tier-1 defense and aerospace customers requiring higher indemnity coverage.",
      },
    ],
  },
];

const meta: Meta<typeof ClauseLibraryBrowser> = {
  title: "Data Display/ClauseLibraryBrowser",
  component: ClauseLibraryBrowser,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ClauseLibraryBrowser>;

export const Default: Story = {
  args: {
    contractContext: "Master Services Agreement (MSA) v4.2",
    categories: mockCategories,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
