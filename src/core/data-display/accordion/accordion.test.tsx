import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Accordion, Collapsible } from "./accordion";

describe("Accordion Primitive", () => {
  it("expands and collapses items on click", () => {
    render(
      <Accordion
        items={[
          { key: "1", title: "General", content: "General content" },
          { key: "2", title: "Advanced", content: "Advanced content" },
        ]}
      />
    );
    expect(screen.getByText("General content")).toBeInTheDocument();
    expect(screen.queryByText("Advanced content")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Advanced"));
    expect(screen.getByText("Advanced content")).toBeInTheDocument();
  });

  it("toggles collapsible content", () => {
    render(<Collapsible title="More Options">Extra parameters</Collapsible>);
    expect(screen.queryByText("Extra parameters")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("More Options"));
    expect(screen.getByText("Extra parameters")).toBeInTheDocument();
  });

  it("forwards ref to accordion and collapsible elements", () => {
    const accordionRef = createRef<HTMLDivElement>();
    const collapsibleRef = createRef<HTMLDivElement>();

    render(
      <Accordion
        ref={accordionRef}
        items={[{ key: "1", title: "General", content: "Content" }]}
      />
    );
    expect(accordionRef.current).toBeInstanceOf(HTMLDivElement);

    render(
      <Collapsible ref={collapsibleRef} title="Options">
        Child
      </Collapsible>
    );
    expect(collapsibleRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <Accordion
        items={[{ key: "1", title: "Section 1", content: "Content 1" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
