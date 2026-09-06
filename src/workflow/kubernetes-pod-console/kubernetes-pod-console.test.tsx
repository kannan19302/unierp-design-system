import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  KubernetesPodConsole,
  PodLogEntry,
} from "./kubernetes-pod-console";

const mockLogs: PodLogEntry[] = [
  {
    id: "l1",
    timestamp: "09:00:01",
    level: "info",
    message: "Starting server on port 3000...",
  },
  {
    id: "l2",
    timestamp: "09:00:02",
    level: "error",
    message: "Failed to connect to database.",
  },
];

describe("KubernetesPodConsole", () => {
  it("renders pod metadata and log stream", () => {
    render(
      <KubernetesPodConsole
        podName="api-pod-123"
        namespace="prod"
        containers={["app", "proxy"]}
        status="Running"
        logs={mockLogs}
      />
    );
    expect(screen.getByText("Pod: api-pod-123")).toBeInTheDocument();
    expect(screen.getByText("ns: prod")).toBeInTheDocument();
    expect(screen.getByText("Starting server on port 3000...")).toBeInTheDocument();
    expect(screen.getByText("Failed to connect to database.")).toBeInTheDocument();
  });

  it("handles container tab selection", () => {
    const onSelect = vi.fn();
    render(
      <KubernetesPodConsole
        podName="api-pod-123"
        containers={["app", "proxy"]}
        status="Running"
        logs={mockLogs}
        onSelectContainer={onSelect}
      />
    );

    const proxyTab = screen.getByRole("tab", { name: /proxy/i });
    fireEvent.click(proxyTab);
    expect(onSelect).toHaveBeenCalledWith("proxy");
  });

  it("filters logs using search box", () => {
    render(
      <KubernetesPodConsole
        podName="api-pod-123"
        containers={["app"]}
        status="Running"
        logs={mockLogs}
      />
    );

    const filterInput = screen.getByPlaceholderText(/Grep logs/i);
    fireEvent.change(filterInput, { target: { value: "database" } });

    expect(screen.queryByText("Starting server on port 3000...")).not.toBeInTheDocument();
    expect(screen.getByText("Failed to connect to database.")).toBeInTheDocument();
  });

  it("passes automated accessibility (axe) checks", async () => {
    const { container } = render(
      <KubernetesPodConsole
        podName="api-pod-123"
        containers={["app"]}
        status="Running"
        logs={mockLogs}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
