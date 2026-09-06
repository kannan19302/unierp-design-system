import type { Meta, StoryObj } from "@storybook/react";
import {
  OrgChartHierarchyTree,
  OrgNode,
} from "./org-chart-hierarchy-tree";

const mockRoot: OrgNode = {
  id: "emp-ceo",
  name: "Dr. Evelyn Vance",
  title: "Chief Executive Officer",
  department: "Executive Leadership",
  avatarInitials: "EV",
  email: "evelyn.vance@aerospace.unierp.com",
  directReportsCount: 4,
  openHeadcountCount: 1,
  children: [
    {
      id: "emp-cto",
      name: "Marcus Aurelius Thorne",
      title: "Chief Technology Officer",
      department: "Engineering & R&D",
      avatarInitials: "MT",
      email: "m.thorne@aerospace.unierp.com",
      directReportsCount: 6,
      openHeadcountCount: 3,
      children: [
        {
          id: "emp-eng-dir",
          name: "Dr. Aris Chen",
          title: "VP, Propulsion Avionics",
          department: "Avionics Systems",
          avatarInitials: "AC",
          email: "aris.chen@aerospace.unierp.com",
          directReportsCount: 8,
          openHeadcountCount: 2,
        },
        {
          id: "emp-qa-dir",
          name: "Sonia Patel",
          title: "Director of Flight QA",
          department: "Quality Assurance",
          avatarInitials: "SP",
          email: "sonia.patel@aerospace.unierp.com",
          directReportsCount: 5,
        },
      ],
    },
    {
      id: "emp-cfo",
      name: "Julian Sterling",
      title: "Chief Financial Officer",
      department: "Treasury & Finance",
      avatarInitials: "JS",
      email: "julian.sterling@aerospace.unierp.com",
      directReportsCount: 3,
      openHeadcountCount: 0,
      children: [
        {
          id: "emp-controller",
          name: "Claire Dupont",
          title: "Corporate Controller",
          department: "Accounting & Audit",
          avatarInitials: "CD",
          email: "claire.dupont@aerospace.unierp.com",
          directReportsCount: 4,
        },
      ],
    },
    {
      id: "emp-coo",
      name: "General Thomas Vance (Ret.)",
      title: "Chief Operating Officer",
      department: "Global Operations",
      avatarInitials: "TV",
      email: "thomas.vance@aerospace.unierp.com",
      directReportsCount: 5,
      openHeadcountCount: 4,
    },
  ],
};

const meta: Meta<typeof OrgChartHierarchyTree> = {
  title: "Data Display/OrgChartHierarchyTree",
  component: OrgChartHierarchyTree,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OrgChartHierarchyTree>;

export const Default: Story = {
  args: {
    rootNode: mockRoot,
    organizationName: "UniERP Global Aerospace & Defense Corporation",
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
