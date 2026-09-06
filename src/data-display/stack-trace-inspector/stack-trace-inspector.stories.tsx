import type { Meta, StoryObj } from "@storybook/react";
import { StackTraceInspector } from "./stack-trace-inspector";
import type { StackFrame } from "./stack-trace-inspector";

const mockFrames: StackFrame[] = [
  {
    id: "f-1",
    fileName: "src/billing/engine/ledger-poster.ts",
    functionName: "postGeneralLedgerBatch",
    lineNumber: 142,
    columnNumber: 18,
    isInApp: true,
    contextLines: [
      { line: 140, code: "  const balance = await calculateBatchBalance(batchId);" },
      { line: 141, code: "  if (Math.abs(balance.variance) > 0.0001) {" },
      { line: 142, code: "    throw new InvariantViolationError(`Voucher out of balance: ${balance.variance}`);", isTarget: true },
      { line: 143, code: "  }" },
      { line: 144, code: "  await db.transaction().commit();" },
    ],
  },
  {
    id: "f-2",
    fileName: "src/billing/controllers/voucher-controller.ts",
    functionName: "authorizeAndPostVoucher",
    lineNumber: 88,
    columnNumber: 9,
    isInApp: true,
    contextLines: [
      { line: 86, code: "  const signoff = await verifyDualControl(req.signoffId);" },
      { line: 87, code: "  if (!signoff.valid) return res.status(403).json();" },
      { line: 88, code: "  await postGeneralLedgerBatch(req.body.voucherId);", isTarget: true },
    ],
  },
  {
    id: "f-3",
    fileName: "node_modules/@nestjs/core/router/router-execution-context.js",
    functionName: "interceptorsConsumer",
    lineNumber: 48,
    isInApp: false,
  },
  {
    id: "f-4",
    fileName: "node_modules/@nestjs/core/router/routes-resolver.js",
    functionName: "dispatch",
    lineNumber: 130,
    isInApp: false,
  },
];

const meta: Meta<typeof StackTraceInspector> = {
  title: "DataDisplay/StackTraceInspector",
  component: StackTraceInspector,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof StackTraceInspector>;

export const ProductionExceptionWithCommit: Story = {
  args: {
    exceptionName: "InvariantViolationError",
    exceptionMessage: "Voucher out of balance: $120.45 difference between debits and credits on batch VCH-2026-991",
    frames: mockFrames,
    suspectCommit: {
      sha: "b4f8e91029c",
      author: "Marcus Vance",
      message: "feat(ledger): add multi-currency exchange rounding logic",
    },
    defaultInAppOnly: true,
    density: "compact",
  },
};

export const AllFramesExpanded: Story = {
  args: {
    exceptionName: "DatabaseConnectionRefused",
    exceptionMessage: "Connection pool exhausted at max_connections = 100 for tenant 'acme-corp'",
    frames: mockFrames,
    defaultInAppOnly: false,
    density: "compact",
  },
};

export const UltraCompactDensity: Story = {
  args: {
    exceptionName: "DeadlockDetectedError",
    exceptionMessage: "Transaction aborted by PostgreSQL concurrency coordinator",
    frames: mockFrames,
    defaultInAppOnly: true,
    density: "ultra-compact",
  },
};
