import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { StackTraceInspector } from "./stack-trace-inspector";
import type { StackFrame } from "./stack-trace-inspector";

const mockFrames: StackFrame[] = [
  {
    id: "f-1",
    fileName: "src/billing/engine.ts",
    functionName: "postBatch",
    lineNumber: 100,
    isInApp: true,
    contextLines: [
      { line: 99, code: "  const ok = true;" },
      { line: 100, code: "  throw new Error('fail');", isTarget: true },
    ],
  },
  {
    id: "f-2",
    fileName: "node_modules/lib/runner.js",
    functionName: "runInternal",
    lineNumber: 45,
    isInApp: false,
  },
];

describe("StackTraceInspector", () => {
  it("renders exception name, message, and in-app frame", () => {
    render(
      <StackTraceInspector
        exceptionName="ConnectionFailed"
        exceptionMessage="Timeout connecting to backend"
        frames={mockFrames}
      />
    );

    expect(screen.getByText("ConnectionFailed")).toBeInTheDocument();
    expect(screen.getByText("Timeout connecting to backend")).toBeInTheDocument();
    expect(screen.getByText("postBatch")).toBeInTheDocument();
  });

  it("filters vendor frames when In-App Only button is toggled", () => {
    render(
      <StackTraceInspector
        exceptionName="Error"
        exceptionMessage="Boom"
        frames={mockFrames}
        defaultInAppOnly={true}
      />
    );

    expect(screen.getByText("postBatch")).toBeInTheDocument();
    expect(screen.queryByText("runInternal")).not.toBeInTheDocument();

    const filterBtn = screen.getByRole("button", { name: /In-App Only/i });
    fireEvent.click(filterBtn);

    expect(screen.getByText("runInternal")).toBeInTheDocument();
  });

  it("renders suspect commit banner when provided", () => {
    render(
      <StackTraceInspector
        exceptionName="Error"
        exceptionMessage="Boom"
        frames={mockFrames}
        suspectCommit={{
          sha: "abcdef123456",
          author: "Jane Dev",
          message: "fix critical bug",
        }}
      />
    );

    expect(screen.getByText("Suspect Commit:")).toBeInTheDocument();
    expect(screen.getByText("abcdef1")).toBeInTheDocument();
    expect(screen.getByText(/Jane Dev/)).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <StackTraceInspector
        exceptionName="ConnectionFailed"
        exceptionMessage="Timeout connecting to backend"
        frames={mockFrames}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
