import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "vitest-axe";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  EditorialShell,
  EditorialBand,
  EditorShell,
  EditorBand,
  Eyebrow,
  HeroTitle,
  BandTitle,
  Lede,
} from "./editor-shell";

const CSS = readFileSync(join(__dirname, "editor-shell.module.css"), "utf8");


describe("EditorialShell", () => {
  it("renders real landmarks, not styled divs", () => {
    // A buyer using a screen reader navigates a marketing page by landmark
    // exactly like any other page. This anatomy has no sidebar to compensate.
    render(
      <EditorialShell brand={<span>UniERP</span>} actions={<a href="/login">Sign in</a>} footer={<small>© UniERP</small>}>
        <EditorialBand>
          <HeroTitle>Enterprise software that feels like a good tool</HeroTitle>
        </EditorialBand>
      </EditorialShell>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", `#${screen.getByRole("main").id}`);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Enterprise software that feels like a good tool",
    );
  });

  it("omits the masthead entirely when there is nothing to put in it", () => {
    render(
      <EditorialShell>
        <EditorialBand>body</EditorialBand>
      </EditorialShell>,
    );
    // An empty <header> landmark is noise for someone cycling landmarks.
    expect(screen.queryByRole("banner")).toBeNull();
  });

  it("exposes the band tone so a page can be checked for alternation", () => {
    const { container } = render(
      <EditorialShell>
        <EditorialBand tone="base">a</EditorialBand>
        <EditorialBand tone="sunken">b</EditorialBand>
        <EditorialBand tone="ink">c</EditorialBand>
      </EditorialShell>,
    );
    const tones = [...container.querySelectorAll("[data-band-tone]")].map((el) =>
      el.getAttribute("data-band-tone"),
    );
    expect(tones).toEqual(["base", "sunken", "ink"]);
  });

  it("keeps the band FULL-BLEED and measures the inner content instead", () => {
    // The usual mistake is constraining the band, which leaves slivers of page
    // background beside every tinted section. The width belongs on .inner.
    const band = /\.band\s*\{[^}]*\}/.exec(CSS)?.[0] ?? "";
    expect(band).toMatch(/width:\s*100%/);
    expect(band).not.toMatch(/max-width/);
    // width:100% + padding overflows the viewport without this, and it does it
    // off the right edge where nobody looks. Caught by measuring, not by eye.
    expect(band).toMatch(/box-sizing:\s*border-box/);
    expect(/\.inner\s*\{[^}]*\}/.exec(CSS)?.[0]).toMatch(
      /max-width:\s*var\(--content-max-width\)/,
    );
  });

  it("does NOT bind the masthead to --header-height", () => {
    // Deliberate divergence: every in-product surface shares that token so the
    // chrome lines up between them. Matching the app's 56px here would make the
    // first thing a buyer sees feel like a console.
    const masthead = /\.masthead\s*\{[^}]*\}/.exec(CSS)?.[0] ?? "";
    expect(masthead).not.toMatch(/--header-height/);
    expect(masthead).toMatch(/min-height/);
  });

  it("uses the semantic Strata emphasis tone for the signal band", () => {
    const stripped = CSS.replace(/\/\*[\s\S]*?\*\//g, "");
    const inSignalBand = /\.band_signal\s*\{[^}]*\}/.exec(stripped)?.[0] ?? "";
    expect(inSignalBand).toMatch(/--color-primary-light/);
    expect(stripped).not.toMatch(/--brand-signal/);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <EditorialShell brand={<span>UniERP</span>} actions={<a href="/login">Sign in</a>} footer={<small>© UniERP</small>}>
        <EditorialBand tone="base" layout="editorial">
          <div>
            <Eyebrow>Platform</Eyebrow>
            <HeroTitle>One system, forty-five modules</HeroTitle>
            <Lede>Composable ERP that a business can actually run on.</Lede>
          </div>
          <div />
        </EditorialBand>
        <EditorialBand tone="signal">
          <BandTitle>Start in an afternoon</BandTitle>
        </EditorialBand>
      </EditorialShell>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("annotates slots with data-slot attributes", () => {
    const { container } = render(
      <EditorialShell
        brand={<span>Logo</span>}
        actions={<button type="button">Action</button>}
        footer={<p>Footer</p>}
      >
        <EditorialBand tone="sunken" layout="editorial">
          <Eyebrow>Overline</Eyebrow>
          <HeroTitle>Main Title</HeroTitle>
          <BandTitle>Sub Title</BandTitle>
          <Lede>Lead paragraph text.</Lede>
        </EditorialBand>
      </EditorialShell>,
    );

    expect(container.querySelector('[data-slot="editor-shell"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="editor-shell-skip-link"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="editor-shell-masthead"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="editor-shell-main"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="editor-shell-footer"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="editor-shell-band"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="editor-shell-band-inner"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="editor-shell-eyebrow"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="editor-shell-hero-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="editor-shell-band-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="editor-shell-lede"]')).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(
      <EditorialShell density="compact">
        <EditorialBand density="compact">Test</EditorialBand>
      </EditorialShell>,
    );

    const root = container.querySelector('[data-slot="editor-shell"]');
    expect(root).toHaveAttribute("data-density", "compact");
    expect(root?.className).toContain("density_compact");

    rerender(
      <EditorialShell density="ultra-compact">
        <EditorialBand density="ultra-compact">Test</EditorialBand>
      </EditorialShell>,
    );
    expect(root).toHaveAttribute("data-density", "ultra-compact");
    expect(root?.className).toContain("density_ultra_compact");
  });

  it("exports directory-aligned EditorShell and EditorBand aliases", () => {
    expect(EditorShell).toBe(EditorialShell);
    expect(EditorBand).toBe(EditorialBand);
  });
});

