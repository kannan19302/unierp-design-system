import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ProjectCard } from "./project-card";

describe("ProjectCard Component", () => {
  it("renders title, description, and metadata accurately", () => {
    render(
      <ProjectCard
        id="test-1"
        title="Supplier Experience"
        description="Portal for suppliers"
        version="v1.2.0"
        lastUpdated="Updated 1h ago"
        author={{ name: "Alex" }}
        type="app"
        status="live"
      />
    );

    expect(screen.getByText("Supplier Experience")).toBeInTheDocument();
    expect(screen.getByText("Portal for suppliers")).toBeInTheDocument();
    expect(screen.getByText("v1.2.0")).toBeInTheDocument();
    expect(screen.getByText("Updated 1h ago")).toBeInTheDocument();
    expect(screen.getByText("by Alex")).toBeInTheDocument();
    expect(screen.getByText("Application")).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("handles keyboard Enter and Space activation when clickable", () => {
    const onClick = vi.fn();
    render(
      <ProjectCard
        id="test-2"
        title="Interactive Card"
        onClick={onClick}
      />
    );

    const card = screen.getByRole("article", { name: "Project: Interactive Card" });
    expect(card).toBeInTheDocument();

    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(card, { key: "Enter" });
    expect(onClick).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(card, { key: " " });
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("handles Open Studio button click independently", () => {
    const onClick = vi.fn();
    const onOpen = vi.fn();
    render(
      <ProjectCard
        id="test-3"
        title="Open Studio Project"
        onClick={onClick}
        onOpen={onOpen}
      />
    );

    const openBtn = screen.getByRole("button", { name: "Open studio for Open Studio Project" });
    fireEvent.click(openBtn);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards ref to card container", () => {
    const ref = createRef<HTMLElement>();
    render(<ProjectCard ref={ref} id="ref-card" title="Ref Project" />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ProjectCard
        id="a11y-card"
        title="Accessible Project"
        description="A thoroughly accessible card implementation"
        onClick={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
