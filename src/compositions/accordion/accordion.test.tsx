import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, Collapsible } from "./accordion";

describe("Accordion Component", () => {
  it("expands and collapses items on click in flat mode", () => {
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

  it("applies data-slot annotations throughout component anatomy", () => {
    const { container } = render(
      <Accordion
        items={[
          { key: "1", title: "Section 1", content: "Content 1" },
        ]}
      />
    );

    expect(container.querySelector('[data-slot="accordion"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="accordion-item"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="accordion-trigger"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="accordion-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="accordion-icon"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="accordion-content"]')).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const { rerender, container } = render(
      <Accordion density="ultra-compact" items={[{ key: "1", title: "T", content: "C" }]} />
    );
    expect(container.querySelector('[data-slot="accordion"]')?.className).toContain("densityUltraCompact");

    rerender(<Accordion density="compact" items={[{ key: "1", title: "T", content: "C" }]} />);
    expect(container.querySelector('[data-slot="accordion"]')?.className).toContain("densityCompact");

    rerender(<Accordion density="standard" items={[{ key: "1", title: "T", content: "C" }]} />);
    expect(container.querySelector('[data-slot="accordion"]')?.className).toContain("densityStandard");

    rerender(<Accordion density="comfortable" items={[{ key: "1", title: "T", content: "C" }]} />);
    expect(container.querySelector('[data-slot="accordion"]')?.className).toContain("densityComfortable");
  });

  it("renders and operates with compound components", () => {
    render(
      <Accordion defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Compound Trigger 1</AccordionTrigger>
          <AccordionContent>Compound Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Compound Trigger 2</AccordionTrigger>
          <AccordionContent>Compound Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText("Compound Content 1")).toBeInTheDocument();
    expect(screen.queryByText("Compound Content 2")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Compound Trigger 2"));
    expect(screen.getByText("Compound Content 2")).toBeInTheDocument();
    expect(screen.queryByText("Compound Content 1")).not.toBeInTheDocument();
  });

  it("toggles collapsible content", () => {
    const { container } = render(<Collapsible title="More Options">Extra parameters</Collapsible>);
    expect(container.querySelector('[data-slot="collapsible"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="collapsible-trigger"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="collapsible-title"]')).toBeInTheDocument();
    expect(screen.queryByText("Extra parameters")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("More Options"));
    expect(screen.getByText("Extra parameters")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="collapsible-content"]')).toBeInTheDocument();
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
