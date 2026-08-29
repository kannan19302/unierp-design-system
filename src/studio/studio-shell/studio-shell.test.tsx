import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import {
  StudioShell,
  STUDIO_BP_PALETTE,
  STUDIO_BP_INSPECTOR,
} from "../studio-shell";
import { StudioToolbar } from "../studio-toolbar";
import { StudioPalette } from "../studio-palette";
import { StudioCanvas } from "../studio-canvas";
import { StudioInspector } from "../studio-inspector";
import { StudioConsole } from "../studio-console";

const tokens = readFileSync(
  resolve(__dirname, "../../tokens/studio.css"),
  "utf8",
);

const px = (name: string): number => {
  const m = tokens.match(new RegExp(String.raw`\s` + name + String.raw`:\s*(\d+)px`));
  if (!m) throw new Error(`${name} is not declared in studio.css`);
  return Number(m[1]);
};

describe("UI_UX_BRIEF §12 rule 1 — the canvas is the page", () => {
  /**
   * The rule is a number, so it gets a test rather than a comment. If someone
   * widens a rail because a property panel felt cramped, this fails and they
   * have to decide deliberately — which is the whole point of writing the rule
   * down. Break it by setting --studio-rail-inspector-w to 320px.
   */
  it("leaves the canvas at least 60% of a 1280px viewport with both rails open", () => {
    const chrome = px("--studio-rail-palette-w") + px("--studio-rail-inspector-w");
    const canvas = (1280 - chrome) / 1280;
    expect(canvas).toBeGreaterThanOrEqual(0.6);
  });

  it("keeps a collapsed rail reachable rather than removing it", () => {
    expect(px("--studio-rail-collapsed-w")).toBeGreaterThan(0);
  });

  /**
   * The breakpoints exist twice — as tokens in studio.css for documentation,
   * and as numbers in studio-shell.tsx where the render decision is made. They
   * cannot be shared (a CSS custom property is not usable inside a media query
   * or matchMedia string), so this asserts they agree. Change one without the
   * other and the rail narrows at a different width than it collapses at,
   * which is the exact bug that put a full palette inside a 44px column.
   */
  it("keeps the CSS and JS breakpoints in step", () => {
    expect(STUDIO_BP_PALETTE).toBe(px("--studio-bp-palette"));
    expect(STUDIO_BP_INSPECTOR).toBe(px("--studio-bp-inspector"));
  });

  it("sheds the inspector before the palette", () => {
    expect(STUDIO_BP_INSPECTOR).toBeGreaterThan(STUDIO_BP_PALETTE);
  });
});

const Harness = ({ withConsole = true }: { withConsole?: boolean }) => (
  <StudioShell
    label="Contact form builder"
    toolbar={<StudioToolbar name="Contact form" kind="Form" />}
    palette={
      <StudioPalette
        groups={[
          {
            id: "inputs",
            label: "Inputs",
            items: [
              { id: "text", label: "Text field" },
              { id: "email", label: "Email field", keywords: ["mail"] },
            ],
          },
        ]}
        onInsert={() => {}}
      />
    }
    canvas={<StudioCanvas label="Contact form layout">fields</StudioCanvas>}
    inspector={<StudioInspector subject="Email field" properties={<p>props</p>} />}
    console={withConsole ? <StudioConsole problems={[]} /> : undefined}
  />
);

describe("StudioShell", () => {
  it("renders exactly one main landmark, labelled", () => {
    render(<Harness />);
    const main = screen.getByRole("main", { name: "Contact form builder" });
    expect(main).toBeInTheDocument();
  });

  it("collapses a rail to a handle that says how to get it back", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    // Open: the palette's search box is present.
    expect(screen.getByRole("searchbox", { name: /search palette/i })).toBeInTheDocument();

    // There is no collapse control inside StudioShell itself (the toolbar owns
    // it in real builders), so drive the state the way a consumer would.
    // Instead assert the collapsed branch renders a labelled handle.
    render(
      <StudioShell
        label="Collapsed"
        defaultPaletteOpen={false}
        palette={<div>never shown</div>}
        canvas={<div>canvas</div>}
      />,
    );
    const handle = screen.getByRole("button", { name: "Show the palette" });
    expect(handle).toHaveAttribute("aria-expanded", "false");

    await user.click(handle);
    expect(screen.queryByText("never shown")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("StudioToolbar — UI_UX_BRIEF §12 rule 3", () => {
  const VERBS = ["Validate", "Preview", "Test run", "Version", "Publish"];

  it("renders the five verbs in a fixed order", () => {
    render(<StudioToolbar name="Anything" />);
    const bar = screen.getByRole("toolbar", { name: /anything actions/i });
    const labels = within(bar)
      .getAllByRole("button")
      .map((b) => b.textContent?.replace(/\d+$/, "").trim());
    expect(labels).toEqual(VERBS);
  });

  it("disables a verb the builder cannot do, rather than hiding it", () => {
    render(<StudioToolbar name="Anything" validate={{ onAction: () => {} }} />);
    expect(screen.getByRole("button", { name: /^Validate/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: /^Preview/ })).toBeDisabled();
  });

  it("states unsaved changes in words, not colour alone", () => {
    render(<StudioToolbar name="Anything" dirty />);
    expect(screen.getByText("Unsaved")).toBeInTheDocument();
  });

  it("badges Validate with the problem count", () => {
    render(<StudioToolbar name="Anything" problemCount={3} />);
    expect(screen.getByLabelText("3 problems")).toHaveTextContent("3");
  });

  it("calls the handler for the verb that was pressed", async () => {
    const user = userEvent.setup();
    const publish = vi.fn();
    render(<StudioToolbar name="Anything" publish={{ onAction: publish }} />);
    await user.click(screen.getByRole("button", { name: /^Publish/ }));
    expect(publish).toHaveBeenCalledTimes(1);
  });
});
