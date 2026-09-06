import type { Meta, StoryObj } from "@storybook/react";
import { DatabaseGrantPrivilegeMatrix } from "./database-grant-privilege-matrix";

const meta: Meta<typeof DatabaseGrantPrivilegeMatrix> = {
  title: "DataGrid/DatabaseGrantPrivilegeMatrix",
  component: DatabaseGrantPrivilegeMatrix,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DatabaseGrantPrivilegeMatrix>;

const mockObjects = [
  {
    id: "obj_wh_analytics",
    name: "COMPUTE_WH_XL",
    type: "WAREHOUSE" as const,
    privileges: {
      USAGE: "GRANTED" as const,
      SELECT: "NONE" as const,
      INSERT: "NONE" as const,
      UPDATE: "NONE" as const,
      DELETE: "NONE" as const,
      OWNERSHIP: "REVOKED" as const,
    },
  },
  {
    id: "obj_db_corp",
    name: "CORP_ENTERPRISE_DB",
    type: "DATABASE" as const,
    privileges: {
      USAGE: "GRANTED" as const,
      SELECT: "INHERITED" as const,
      INSERT: "REVOKED" as const,
      UPDATE: "NONE" as const,
      DELETE: "NONE" as const,
      OWNERSHIP: "NONE" as const,
    },
  },
  {
    id: "obj_tbl_ledger",
    name: "FINANCE.GL_JOURNAL_ENTRIES",
    type: "TABLE" as const,
    privileges: {
      USAGE: "INHERITED" as const,
      SELECT: "GRANTED" as const,
      INSERT: "GRANTED" as const,
      UPDATE: "REVOKED" as const,
      DELETE: "REVOKED" as const,
      OWNERSHIP: "NONE" as const,
    },
  },
  {
    id: "obj_vw_mrr",
    name: "ANALYTICS.VW_EXECUTIVE_MRR",
    type: "VIEW" as const,
    privileges: {
      USAGE: "INHERITED" as const,
      SELECT: "GRANTED" as const,
      INSERT: "NONE" as const,
      UPDATE: "NONE" as const,
      DELETE: "NONE" as const,
      OWNERSHIP: "NONE" as const,
    },
  },
];

export const Default: Story = {
  args: {
    currentRole: "DATA_ENGINEER",
    roles: ["ACCOUNTADMIN", "SYSADMIN", "DATA_ENGINEER", "DATA_ANALYST", "AUDITOR_READONLY"],
    objects: mockObjects,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    currentRole: "DATA_ANALYST",
    roles: ["ACCOUNTADMIN", "SYSADMIN", "DATA_ENGINEER", "DATA_ANALYST"],
    objects: mockObjects,
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    currentRole: "ACCOUNTADMIN",
    roles: ["ACCOUNTADMIN", "SYSADMIN", "DATA_ENGINEER"],
    objects: mockObjects,
    density: "comfortable",
  },
};
