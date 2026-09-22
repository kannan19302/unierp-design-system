import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { axe } from "vitest-axe";
import { MeridianBar, formatSegments } from "./meridian-bar";


/**
 * The bar's whole claim is that it is IDENTICAL on eleven surfaces with eleven
 * different layout anatomies. A claim like that decays the moment one shell
 * decides it needs the verb on the left "just here", and it decays invisibly,
 * because every individual screen still looks fine.
 *
 * So the contract is asserted, not documented: three slots, fixed order, height
 * from the token, one primary verb, and a disabled verb that states why.
 */

const ADDRESS = [
  { label: "acme", href: "/" },
  { label: "finance", href: "/finance" },
  { label: "invoices", href: "/finance/invoices" },
  { label: "INV-2043" },
];

function stubClipboard(value: unknown) {
  Object.defineProperty(navigator, "clipboard", {
    value,
    configurable: true,
    writable: true,
  });
}

describe("MeridianBar", () => {
  it("renders the three answers in the fixed order: address, state, verb", () => {
    const { container } = render(
      <MeridianBar
        segments={ADDRESS}
        state={{ label: "Awaiting approval", tone: "warning" }}
        action={{ label: "Approve" }}
      />,
    );

    // DOM order IS the contract — a screen reader and a keyboard user both
    // traverse in this order, so "same position" has to mean source order too,
    // not merely a visual arrangement CSS could reverse.
    const text = container.textContent ?? "";
    expect(text.indexOf("INV-2043")).toBeLessThan(text.indexOf("Awaiting approval"));
    expect(text.indexOf("Awaiting approval")).toBeLessThan(text.indexOf("Approve"));
  });

  it("takes its height from --meridian-bar-height, never a literal", () => {
    // This is the position guarantee. If a refactor inlines 44px here, the bar
    // silently stops tracking the token and compact density (or any future
    // theme that moves it) desynchronises the eleven surfaces.
    const css = String(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("fs").readFileSync(
        require("path").join(__dirname, "meridian-bar.module.css"),
        "utf8",
      ),

    );
    expect(css).toMatch(/min-height:\s*var\(--meridian-bar-height/);
    expect(css).not.toMatch(/min-height:\s*44px/);
  });

  it("marks the leaf segment and links only the ancestors", () => {
    render(<MeridianBar segments={ADDRESS} />);

    expect(screen.getByRole("link", { name: "finance" })).toHaveAttribute(
      "href",
      "/finance",
    );
    // The leaf is where you already are; linking it is a link to nowhere.
    expect(screen.queryByRole("link", { name: "INV-2043" })).toBeNull();
    expect(screen.getByText("INV-2043")).toBeInTheDocument();
  });

  it("omits the state slot entirely when nothing is pending", () => {
    const { container } = render(<MeridianBar segments={ADDRESS} />);
    // Absent, not an empty pill. Design law 4: a screen with nothing wrong is
    // quiet, and a bar that always shows a chip teaches people to ignore it.
    expect(container.querySelectorAll("[class*='state']")).toHaveLength(0);
  });

  it("fires the primary action", async () => {
    const onClick = vi.fn();
    render(<MeridianBar segments={ADDRESS} action={{ label: "Approve", onClick }} />);
    await userEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("DISABLES the verb with a stated reason, and never hides it", async () => {
    const onClick = vi.fn();
    render(
      <MeridianBar
        segments={ADDRESS}
        action={{
          label: "Approve",
          onClick,
          disabled: true,
          disabledReason: "Needs a second approver above 10,000.",
        }}
      />,
    );

    const verb = screen.getByRole("button", { name: "Approve" });
    // Still present — §12.3's rule is "disabled with a stated reason, not
    // hidden", so the bar has the same shape whether or not you can act.
    expect(verb).toBeInTheDocument();
    expect(verb).toBeDisabled();

    await userEvent.click(verb);
    expect(onClick).not.toHaveBeenCalled();

    // The reason reaches a screen reader, not only the sighted user who can
    // read the grey text beside the button.
    const describedBy = verb.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent(
      "Needs a second approver above 10,000.",
    );
  });

  it("copies the plain address and confirms in words, not only in the icon", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ writeText });

    render(<MeridianBar segments={ADDRESS} copyable />);
    await userEvent.click(
      screen.getByRole("button", { name: /Copy address acme\/finance\/invoices\/INV-2043/ }),
    );

    expect(writeText).toHaveBeenCalledWith("acme/finance/invoices/INV-2043");
    expect(await screen.findByRole("button", { name: /^Copied / })).toBeInTheDocument();
  });

  it("does not throw where there is no clipboard", async () => {
    stubClipboard(undefined);
    render(<MeridianBar segments={ADDRESS} copyable />);
    await userEvent.click(screen.getByRole("button", { name: /^Copy address/ }));
    expect(screen.getByRole("button", { name: /^Copy address/ })).toBeInTheDocument();
  });

  it("accepts a rendered address node instead of segments", () => {
    // developer-platform passes its <ArtifactAddress> straight through, keeping
    // the scope hue and the em-dash gap that component defends.
    render(
      <MeridianBar
        address={<span data-testid="custom">acme / library / — / forms / leave-request</span>}
        action={{ label: "Publish" }}
      />,
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument();
  });

  it("formatSegments round-trips to the string form", () => {
    expect(formatSegments(ADDRESS)).toBe("acme/finance/invoices/INV-2043");
  });

  it("has no axe violations, including with a disabled verb", async () => {
    const { container } = render(
      <MeridianBar
        segments={ADDRESS}
        copyable
        scope="app"
        state={{ label: "Awaiting approval", tone: "warning" }}
        action={{
          label: "Approve",
          disabled: true,
          disabledReason: "Needs a second approver.",
        }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
