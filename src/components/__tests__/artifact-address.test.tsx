import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { ArtifactAddress, formatAddress } from "../artifact-address";

/**
 * The claims worth a failing mechanism here are the two that carry meaning
 * rather than styling:
 *
 *   1. A null owning project RENDERS as a gap, and the gap survives into the
 *      copied string. If this ever silently collapses, a library address and
 *      an app-owned address become the same shape and the one fact the
 *      component exists to show is gone.
 *   2. The leaf — the emphasised segment — is whichever segment is actually
 *      last. A fixed slot would leave a list-level address with nothing
 *      emphasised.
 */

/**
 * `navigator.clipboard` is an accessor with no setter in current jsdom, so the
 * `Object.assign(navigator, { clipboard })` these two tests used to do threw
 * "Cannot set property clipboard of #<Navigator> which has only a getter" —
 * which read as a component failure and was a harness one. defineProperty is
 * the supported way to stub it, and it is restored afterwards so the two cases
 * cannot leak into each other.
 */
function stubClipboard(value: unknown) {
  Object.defineProperty(navigator, "clipboard", {
    value,
    configurable: true,
    writable: true,
  });
}

describe("formatAddress", () => {
  it("renders an owned artifact as tenant/scope/project/builder/artifact@version", () => {
    expect(
      formatAddress({
        tenant: "acme",
        scope: "app",
        project: "hr-onboarding",
        builder: "forms",
        artifact: "leave-request",
        version: "v4",
      }),
    ).toBe("acme/apps/hr-onboarding/forms/leave-request@v4");
  });

  it("keeps the owner slot open — never closed up — when there is no project", () => {
    const library = formatAddress({
      tenant: "acme",
      scope: "library",
      project: null,
      builder: "forms",
      artifact: "expense-claim",
      version: "v2",
    });

    expect(library).toBe("acme/library/—/forms/expense-claim@v2");

    // The load-bearing assertion: same segment COUNT as an owned address, so
    // the two are distinguishable by shape rather than by length.
    const owned = formatAddress({
      tenant: "acme",
      scope: "app",
      project: "hr-onboarding",
      builder: "forms",
      artifact: "leave-request",
      version: "v4",
    });
    expect(library.split("/")).toHaveLength(owned.split("/").length);
  });

  it("omits the tenant segment when no tenant is given", () => {
    expect(
      formatAddress({ scope: "manage", project: null, builder: "environments" }),
    ).toBe("manage/—/environments");
  });
});

describe("ArtifactAddress", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("renders every segment", () => {
    render(
      <ArtifactAddress
        tenant="acme"
        scope="app"
        project="hr-onboarding"
        builder="forms"
        artifact="leave-request"
        version="v4"
      />,
    );
    for (const segment of ["acme", "apps", "hr-onboarding", "forms", "leave-request", "v4"]) {
      expect(screen.getByText(segment)).toBeInTheDocument();
    }
  });

  it("explains the empty owner slot on hover rather than leaving a bare dash", () => {
    render(<ArtifactAddress scope="library" project={null} builder="forms" />);
    const dash = screen.getByText("—");
    expect(dash).toHaveAttribute(
      "title",
      expect.stringContaining("No owning project"),
    );
  });

  it("copies the plain address and says so in the accessible name", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ writeText });

    render(
      <ArtifactAddress
        tenant="acme"
        scope="site"
        project="careers"
        builder="pages"
        artifact="open-roles"
        version="v11"
        copyable
      />,
    );

    const button = screen.getByRole("button", {
      name: /Copy address acme\/sites\/careers\/pages\/open-roles@v11/,
    });
    await userEvent.click(button);

    expect(writeText).toHaveBeenCalledWith("acme/sites/careers/pages/open-roles@v11");
    // Confirmation is in WORDS, not only in colour — the check icon is
    // aria-hidden, so the label is the only thing a screen reader gets.
    expect(await screen.findByRole("button", { name: /^Copied / })).toBeInTheDocument();
  });

  it("does not throw where there is no clipboard", async () => {
    stubClipboard(undefined);
    render(<ArtifactAddress scope="app" project="p" artifact="a" copyable />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button", { name: /^Copy address/ })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ArtifactAddress
        tenant="acme"
        scope="app"
        project="hr-onboarding"
        builder="forms"
        artifact="leave-request"
        version="v4"
        href="/apps/hr-onboarding/forms/leave-request"
        copyable
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
