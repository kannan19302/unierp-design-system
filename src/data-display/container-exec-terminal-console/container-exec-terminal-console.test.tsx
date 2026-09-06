import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  ContainerExecTerminalConsole,
  TerminalSessionTab,
} from "./container-exec-terminal-console";

const sampleSessions: TerminalSessionTab[] = [
  {
    id: "sess-1",
    containerName: "api-worker-0",
    podName: "unierp-api-7b89f-2m19a",
    state: "running",
    restartCount: 0,
  },
  {
    id: "sess-2",
    containerName: "redis-sentinel-1",
    podName: "redis-ha-cluster-01",
    state: "running",
    restartCount: 1,
  },
];

describe("ContainerExecTerminalConsole", () => {
  it("renders cluster header, container tabs, and logs", () => {
    render(<ContainerExecTerminalConsole sessions={sampleSessions} />);

    expect(screen.getByText("Container Interactive Exec Terminal & TTY Console")).toBeDefined();
    expect(screen.getByText("api-worker-0")).toBeDefined();
    expect(screen.getByText("redis-sentinel-1")).toBeDefined();
  });

  it("submits command and triggers onExecuteCommand callback", () => {
    const handleCommand = vi.fn();

    render(
      <ContainerExecTerminalConsole
        sessions={sampleSessions}
        onExecuteCommand={handleCommand}
      />
    );

    const input = screen.getByPlaceholderText(/Type bash or shell command/i);
    fireEvent.change(input, { target: { value: "uname -a" } });

    const sendBtn = screen.getByRole("button", { name: /Send command to container/i });
    fireEvent.click(sendBtn);

    expect(handleCommand).toHaveBeenCalledWith("sess-1", "uname -a");
    expect(screen.getByText("$ uname -a")).toBeDefined();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ContainerExecTerminalConsole sessions={sampleSessions} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
