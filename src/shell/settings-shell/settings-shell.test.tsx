import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { axe } from "vitest-axe";
import { SettingsShell, type SettingsItem } from "../settings-shell";

const ITEMS: SettingsItem[] = [
  { id: "sso", label: "Single sign-on", href: "/s/sso", group: "Access", keywords: ["saml", "oidc", "sso"] },
  { id: "mfa", label: "Multi-factor", href: "/s/mfa", group: "Access", keywords: ["2fa", "totp"] },
  { id: "retention", label: "Data retention", href: "/s/retention", group: "Data", keywords: ["gdpr", "purge"] },
];

describe("SettingsShell", () => {
  it("finds a tab by the word the ADMIN knows, not only by its label", async () => {
    // The case that matters: searching "SAML" must find a tab called
    // "Single sign-on". A label-only search returns nothing here, which is how
    // an index of seventy tabs becomes unusable while looking fine in review.
    render(<SettingsShell items={ITEMS} />);
    await userEvent.type(screen.getByRole("searchbox"), "saml");

    expect(screen.getByRole("link", { name: "Single sign-on" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Data retention" })).toBeNull();
  });

  it("searches group names too", async () => {
    render(<SettingsShell items={ITEMS} />);
    await userEvent.type(screen.getByRole("searchbox"), "access");
    expect(screen.getByRole("link", { name: "Single sign-on" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Multi-factor" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Data retention" })).toBeNull();
  });

  it("says what matched nothing and suggests what to do", async () => {
    render(<SettingsShell items={ITEMS} />);
    await userEvent.type(screen.getByRole("searchbox"), "zzzz");
    expect(screen.getByRole("status")).toHaveTextContent(/Nothing matches/);
    expect(screen.getByRole("status")).toHaveTextContent(/shorter word/);
  });

  it("marks the current tab with aria-current, not only a colour", () => {
    render(<SettingsShell items={ITEMS} activeId="mfa" />);
    expect(screen.getByRole("link", { name: "Multi-factor" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Single sign-on" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("ALWAYS renders the footer — clean and dirty are both states, not present/absent", () => {
    // A footer that appears only when dirty is a layout shift at the exact
    // moment the user is typing, and it teaches nobody where the save button
    // lives. It is always there; only its state changes.
    const { container, rerender } = render(<SettingsShell items={ITEMS} />);
    expect(container.querySelector("[data-dirty]")).toHaveAttribute("data-dirty", "false");
    expect(screen.getByText("All changes saved.")).toBeInTheDocument();

    rerender(<SettingsShell items={ITEMS} dirty />);
    expect(container.querySelector("[data-dirty]")).toHaveAttribute("data-dirty", "true");
    expect(screen.getByText("You have unsaved changes.")).toBeInTheDocument();
  });

  it("announces the dirty state to assistive tech", () => {
    const { container } = render(<SettingsShell items={ITEMS} dirty />);
    const live = container.querySelector("[aria-live]");
    expect(live).toHaveTextContent("You have unsaved changes.");
  });

  it("disables Save and Discard until there is something to save", async () => {
    const onSave = vi.fn();
    render(<SettingsShell items={ITEMS} onSave={onSave} />);

    const save = screen.getByRole("button", { name: "Save changes" });
    expect(save).toBeDisabled();
    await userEvent.click(save);
    expect(onSave).not.toHaveBeenCalled();
  });

  it("saves and discards when dirty, in [Discard] [Save] order", async () => {
    const onSave = vi.fn();
    const onDiscard = vi.fn();
    render(<SettingsShell items={ITEMS} dirty onSave={onSave} onDiscard={onDiscard} />);

    const buttons = screen.getAllByRole("button").map((b) => b.textContent);
    // §7: order is always [Cancel] [Confirm]; the destructive one never gets
    // the position the eye lands on last.
    expect(buttons).toEqual(["Discard", "Save changes"]);

    await userEvent.click(screen.getByRole("button", { name: "Discard" }));
    expect(onDiscard).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("blocks both actions while saving", () => {
    render(<SettingsShell items={ITEMS} dirty saving />);
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Discard" })).toBeDisabled();
  });

  it("has no axe violations, clean and dirty", async () => {
    const clean = render(
      <SettingsShell items={ITEMS} activeId="sso">
        <label htmlFor="f">Provider</label>
        <input id="f" />
      </SettingsShell>,
    );
    expect(await axe(clean.container)).toHaveNoViolations();
    clean.unmount();

    const dirty = render(
      <SettingsShell items={ITEMS} activeId="sso" dirty>
        <label htmlFor="g">Provider</label>
        <input id="g" />
      </SettingsShell>,
    );
    expect(await axe(dirty.container)).toHaveNoViolations();
  });
});
