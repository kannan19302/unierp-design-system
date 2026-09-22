import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { SecretEnvironmentEditor } from "./secret-environment-editor";
import type { SecretItem } from "./secret-environment-editor";

const mockSecrets: SecretItem[] = [
  {
    id: "sec-1",
    key: "DATABASE_URL",
    value: "postgres://prod_db:secret@aws.com/db",
    scope: "production",
  },
  {
    id: "sec-2",
    key: "DEV_KEY",
    value: "dev-secret-token",
    scope: "development",
  },
];

describe("SecretEnvironmentEditor", () => {
  it("renders secret keys and masked values", () => {
    render(<SecretEnvironmentEditor initialSecrets={mockSecrets} />);

    expect(screen.getByText("DATABASE_URL")).toBeInTheDocument();
    expect(screen.getByText("DEV_KEY")).toBeInTheDocument();
    expect(screen.getAllByText("••••••••••••••••").length).toBe(2);
  });

  it("reveals and hides secret value on eye toggle click", () => {
    render(<SecretEnvironmentEditor initialSecrets={mockSecrets} />);

    const revealBtn = screen.getByRole("button", { name: /Reveal DATABASE_URL/i });
    fireEvent.click(revealBtn);

    expect(screen.getByText("postgres://prod_db:secret@aws.com/db")).toBeInTheDocument();

    const hideBtn = screen.getByRole("button", { name: /Hide DATABASE_URL/i });
    fireEvent.click(hideBtn);

    expect(screen.queryByText("postgres://prod_db:secret@aws.com/db")).not.toBeInTheDocument();
  });

  it("filters secrets when scope tab is clicked", () => {
    render(<SecretEnvironmentEditor initialSecrets={mockSecrets} defaultScope="all" />);

    const devTab = screen.getByRole("button", { name: "development" });
    fireEvent.click(devTab);

    expect(screen.getByText("DEV_KEY")).toBeInTheDocument();
    expect(screen.queryByText("DATABASE_URL")).not.toBeInTheDocument();
  });

  it("adds a new secret key-value row", () => {
    const onChange = vi.fn();
    render(<SecretEnvironmentEditor initialSecrets={mockSecrets} onChange={onChange} />);

    const keyInput = screen.getByLabelText(/New Variable Key/i);
    const valueInput = screen.getByLabelText(/New Variable Secret Value/i);
    const addBtn = screen.getByRole("button", { name: /Add Environment Secret/i });

    fireEvent.change(keyInput, { target: { value: "REDIS_HOST" } });
    fireEvent.change(valueInput, { target: { value: "redis://cache.internal:6379" } });
    fireEvent.click(addBtn);

    expect(screen.getByText("REDIS_HOST")).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: "REDIS_HOST", value: "redis://cache.internal:6379" }),
      ])
    );
  });

  it("deletes a secret row", () => {
    const onChange = vi.fn();
    render(<SecretEnvironmentEditor initialSecrets={mockSecrets} onChange={onChange} />);

    const deleteBtn = screen.getByRole("button", { name: /Delete DEV_KEY/i });
    fireEvent.click(deleteBtn);

    expect(screen.queryByText("DEV_KEY")).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<SecretEnvironmentEditor initialSecrets={mockSecrets} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
