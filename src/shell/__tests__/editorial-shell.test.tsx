import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "vitest-axe";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  EditorialShell,
  EditorialBand,
  Eyebrow,
  HeroTitle,
  BandTitle,
  Lede,
} from "../editorial-shell";

const CSS = readFileSync(join(__dirname, "..", "editorial-shell.module.css"), "utf8");

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

  it("confines --brand-signal to the signal band and nowhere else", () => {
    // §13.1: coral is marketing-only, and within marketing it is one band.
    // Strip comments FIRST, then extract the rule from the same text the
    // assertion searches — extracting from the commented copy and searching the
    // stripped one never matches, which is a test that always passes for the
    // wrong reason. (It failed loudly here instead, which is the better bug.)
    const stripped = CSS.replace(/\/\*[\s\S]*?\*\//g, "");
    const inSignalBand = /\.band_signal\s*\{[^}]*\}/.exec(stripped)?.[0] ?? "";
    expect(inSignalBand).toMatch(/--brand-signal/);
    const outside = stripped.replace(inSignalBand, "").match(/--brand-signal/g) ?? [];
    expect(outside).toHaveLength(0);
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
});
