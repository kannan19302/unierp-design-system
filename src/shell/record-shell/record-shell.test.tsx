import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "vitest-axe";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RecordShell, ObjectPage } from "./record-shell";

const CSS = readFileSync(join(__dirname, "record-shell.module.css"), "utf8");


describe("RecordShell", () => {
  it("derives the column count from the slots actually filled", () => {
    // Not a `columns={3}` prop. A configured count with an unfilled slot renders
    // an empty column, and an empty column looks like a loading failure.
    const { container, rerender } = render(<RecordShell detail={<p>record</p>} />);
    expect(container.querySelector("[data-columns]")).toHaveAttribute("data-columns", "1");

    rerender(<RecordShell list={<p>list</p>} detail={<p>record</p>} />);
    expect(container.querySelector("[data-columns]")).toHaveAttribute("data-columns", "2");

    rerender(
      <RecordShell list={<p>list</p>} detail={<p>record</p>} inspector={<p>props</p>} />,
    );
    expect(container.querySelector("[data-columns]")).toHaveAttribute("data-columns", "3");
  });

  it("labels the rail and the inspector as distinct landmarks", () => {
    render(
      <RecordShell
        rail={<a href="/finance">Finance</a>}
        list={<p>list</p>}
        detail={<p>record</p>}
        inspector={<p>props</p>}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Modules" })).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Inspector" })).toBeInTheDocument();
  });

  it("collapses the rail to an icon rail, NEVER to zero", () => {
    // A rail that collapses to nothing takes the module switcher with it, so the
    // only way back is the browser's back button. That is the shape the provider
    // console shipped with (`width: sidebarOpen ? 264 : 0`).
    const collapsed = /\.rail_collapsed\s*\{[^}]*\}/.exec(CSS)?.[0] ?? "";
    expect(collapsed).toMatch(/width:\s*var\(--sidebar-collapsed-width\)/);
    expect(collapsed).not.toMatch(/width:\s*0/);
    expect(collapsed).not.toMatch(/display:\s*none/);
  });

  it("scrolls each column independently, not the page", () => {
    // One page scrollbar for three columns means scrolling a long record also
    // scrolls the list it was chosen from — the lost context this layout exists
    // to prevent.
    expect(/\.column\s*\{[^}]*\}/.exec(CSS)?.[0]).toMatch(/overflow-y:\s*auto/);
    expect(/\.columns\s*\{[^}]*\}/.exec(CSS)?.[0]).toMatch(/overflow:\s*hidden/);
  });

  it("does not split three columns into equal thirds", () => {
    // The naive split makes the record — the thing being worked on — the
    // narrowest of the three.
    const three = /\.cols_3\s*\{[^}]*\}/.exec(CSS)?.[0] ?? "";
    const fractions = [...three.matchAll(/(\d+)fr/g)].map((m) => Number(m[1]));
    expect(fractions).toHaveLength(3);
    expect(new Set(fractions).size).toBeGreaterThan(1);
    // The middle column is the widest.
    expect(fractions[1]).toBeGreaterThan(fractions[0]!);
    expect(fractions[1]).toBeGreaterThan(fractions[2]!);
  });

  it("sheds the inspector before the list at narrow widths", () => {
    // A property panel is useless once the record it describes is off screen,
    // so the inspector goes first — §12.3's rule, one altitude up.
    const at1280 = CSS.slice(CSS.indexOf("@media (max-width: 1280px)"), CSS.indexOf("@media (max-width: 900px)"));
    expect(at1280).toMatch(/column_inspector/);
    expect(at1280).not.toMatch(/column:first-child/);
  });
});

describe("ObjectPage", () => {
  const SECTIONS = [
    { id: "summary", label: "Summary", children: <p>s</p> },
    { id: "lines", label: "Lines", children: <p>l</p> },
    { id: "history", label: "History", children: <p>h</p> },
  ];

  it("renders anchors as real in-page links, not scroll buttons", () => {
    // Real links work with the keyboard, middle-click and no JavaScript, and
    // put the section in the URL so it can be shared. A button with a scroll
    // handler gives up all four for nothing.
    render(<ObjectPage sections={SECTIONS} activeId="lines" />);
    const nav = screen.getByRole("navigation", { name: "Sections" });
    expect(nav.querySelectorAll("button")).toHaveLength(0);
    expect(screen.getByRole("link", { name: "Summary" })).toHaveAttribute("href", "#summary");
  });

  it("marks the active section for assistive tech, not only by colour", () => {
    render(<ObjectPage sections={SECTIONS} activeId="lines" />);
    expect(screen.getByRole("link", { name: "Lines" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: "Summary" })).not.toHaveAttribute("aria-current");
  });

  it("gives every section a heading its region is labelled by", () => {
    render(<ObjectPage sections={SECTIONS} />);
    for (const s of SECTIONS) {
      expect(screen.getByRole("heading", { name: s.label })).toBeInTheDocument();
    }
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <RecordShell
        rail={<a href="/finance">Finance</a>}
        list={<p>list</p>}
        detail={<ObjectPage sections={SECTIONS} activeId="summary" />}
        inspector={<p>props</p>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
