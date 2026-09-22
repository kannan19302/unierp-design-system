import { describe, expect, it, vi } from "vitest";
import { render, screen, renderHook, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { StudioPalette, type PaletteGroup } from "../studio-palette";
import { StudioInspector } from "../studio-inspector";
import { StudioConsole } from "../studio-console";
import { PublishDiffDialog } from "../publish-diff-dialog";
import { useStudioDocument } from "../use-studio-document";

const GROUPS: PaletteGroup[] = [
  {
    id: "inputs",
    label: "Inputs",
    items: [
      { id: "text", label: "Text field" },
      { id: "email", label: "Email field", keywords: ["mail"] },
    ],
  },
  {
    id: "layout",
    label: "Layout",
    items: [
      { id: "section", label: "Section" },
      {
        id: "locked",
        label: "Repeater",
        disabled: true,
        disabledReason: "Needs a data source",
      },
    ],
  },
];

describe("StudioPalette — drag is an accelerator, never the only path", () => {
  it("inserts with the keyboard alone", async () => {
    const user = userEvent.setup();
    const onInsert = vi.fn();
    render(<StudioPalette groups={GROUPS} onInsert={onInsert} />);

    // Cursor starts on the first item; ArrowDown moves to the next one.
    await user.tab(); // focus the search box
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onInsert).toHaveBeenCalledWith(
      expect.objectContaining({ id: "email" }),
    );
  });

  it("crosses a group boundary with ArrowDown rather than stopping at it", async () => {
    const user = userEvent.setup();
    const onInsert = vi.fn();
    render(<StudioPalette groups={GROUPS} onInsert={onInsert} />);
    await user.tab();
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(onInsert).toHaveBeenCalledWith(
      expect.objectContaining({ id: "section" }),
    );
  });

  it("filters on keywords the label does not contain", async () => {
    const user = userEvent.setup();
    render(<StudioPalette groups={GROUPS} onInsert={() => {}} />);
    await user.type(screen.getByRole("searchbox"), "mail");
    expect(
      screen.getByRole("button", { name: "Email field" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Text field" }),
    ).not.toBeInTheDocument();
  });

  it("does not leave Enter as a silent no-op after a filter shortens the list", async () => {
    const user = userEvent.setup();
    const onInsert = vi.fn();
    render(<StudioPalette groups={GROUPS} onInsert={onInsert} />);
    const box = screen.getByRole("searchbox");
    // Walk the cursor past where the filtered list will end, then filter.
    await user.click(box);
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    await user.type(box, "section");
    await user.keyboard("{Enter}");
    expect(onInsert).toHaveBeenCalledWith(
      expect.objectContaining({ id: "section" }),
    );
  });

  it("refuses to insert a disabled item and says why", async () => {
    const user = userEvent.setup();
    const onInsert = vi.fn();
    render(<StudioPalette groups={GROUPS} onInsert={onInsert} />);
    const locked = screen.getByRole("button", { name: "Repeater" });
    expect(locked).toBeDisabled();
    expect(locked).toHaveAttribute("title", "Needs a data source");
    await user.click(locked);
    expect(onInsert).not.toHaveBeenCalled();
  });

  it("tells the user when a search matches nothing", async () => {
    const user = userEvent.setup();
    render(<StudioPalette groups={GROUPS} onInsert={() => {}} />);
    await user.type(screen.getByRole("searchbox"), "zzzz");
    expect(screen.getByText(/nothing matches/i)).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <StudioPalette groups={GROUPS} onInsert={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("StudioInspector — a rail, not a modal", () => {
  it("keeps the four tabs even when a builder fills only one", () => {
    render(<StudioInspector subject="Email field" properties={<p>props</p>} />);
    for (const label of ["Properties", "Logic", "Style", "Advanced"]) {
      expect(screen.getByRole("tab", { name: label })).toBeInTheDocument();
    }
  });

  it("says an empty tab is empty rather than rendering nothing", async () => {
    const user = userEvent.setup();
    render(<StudioInspector subject="Email field" properties={<p>props</p>} />);
    await user.click(screen.getByRole("tab", { name: "Logic" }));
    expect(screen.getByText(/has no logic settings/i)).toBeInTheDocument();
  });

  it("prompts when nothing is selected", () => {
    render(<StudioInspector />);
    expect(
      screen.getByText(/select something on the canvas/i),
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <StudioInspector subject="Email field" properties={<p>props</p>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("StudioConsole — a problem is actionable or it is not a problem", () => {
  const PROBLEMS = [
    {
      id: "1",
      severity: "error" as const,
      message: "Field has no name",
      targetId: "f1",
    },
    {
      id: "2",
      severity: "warning" as const,
      message: "Unused step",
      targetId: "s2",
    },
    { id: "3", severity: "error" as const, message: "Nowhere to point" },
  ];

  it("shows the counts on the collapsed bar so collapsing cannot hide a failure", () => {
    render(<StudioConsole problems={PROBLEMS} />);
    expect(screen.getByLabelText("2 errors")).toBeInTheDocument();
    expect(screen.getByLabelText("1 warnings")).toBeInTheDocument();
    // The body is not rendered while collapsed.
    expect(screen.queryByText("Field has no name")).not.toBeInTheDocument();
  });

  it("locates the element a problem is about", async () => {
    const user = userEvent.setup();
    const onLocate = vi.fn();
    render(
      <StudioConsole problems={PROBLEMS} onLocate={onLocate} defaultOpen />,
    );
    await user.click(screen.getByRole("button", { name: /Field has no name/ }));
    expect(onLocate).toHaveBeenCalledWith("f1");
  });

  it("disables a problem with nothing to locate instead of offering a dead click", () => {
    render(
      <StudioConsole problems={PROBLEMS} onLocate={() => {}} defaultOpen />,
    );
    expect(
      screen.getByRole("button", { name: /Nowhere to point/ }),
    ).toBeDisabled();
  });

  it("is quiet when nothing is wrong", () => {
    render(<StudioConsole problems={[]} defaultOpen />);
    expect(screen.getByText("No problems found.")).toBeInTheDocument();
    expect(screen.queryByLabelText(/errors/)).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <StudioConsole problems={PROBLEMS} onLocate={() => {}} defaultOpen />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("PublishDiffDialog — nothing publishes silently", () => {
  const CHANGES = [
    { id: "a", kind: "added" as const, what: "Phone field" },
    {
      id: "b",
      kind: "changed" as const,
      what: "Email field",
      detail: "required: false to true",
    },
  ];

  it("names the environment and the rollback target before the button is live", () => {
    render(
      <PublishDiffDialog
        open
        onClose={() => {}}
        name="Contact form"
        environment="production"
        rollbackTo="v11"
        changes={CHANGES}
        onPublish={() => {}}
      />,
    );
    expect(
      screen.getByRole("button", { name: /Publish to production/ }),
    ).toBeEnabled();
    expect(screen.getByText(/rolls back to v11/)).toBeInTheDocument();
  });

  it("states each change in words, so colour is never the only signal", () => {
    render(
      <PublishDiffDialog
        open
        onClose={() => {}}
        name="Contact form"
        environment="production"
        changes={CHANGES}
        onPublish={() => {}}
      />,
    );
    expect(screen.getByText("added")).toBeInTheDocument();
    expect(screen.getByText("changed")).toBeInTheDocument();
  });

  it("refuses an empty publish rather than bumping a version for nothing", () => {
    render(
      <PublishDiffDialog
        open
        onClose={() => {}}
        name="Contact form"
        environment="production"
        changes={[]}
        onPublish={() => {}}
      />,
    );
    expect(
      screen.getByRole("button", { name: /Publish to production/ }),
    ).toBeDisabled();
  });
});

describe("useStudioDocument", () => {
  it("tracks dirty against the last reset, not against the initial value", () => {
    const { result } = renderHook(() => useStudioDocument({ n: 1 }));
    expect(result.current.dirty).toBe(false);
    act(() => result.current.update({ n: 2 }));
    expect(result.current.dirty).toBe(true);
    act(() => result.current.reset({ n: 2 }, "v3"));
    expect(result.current.dirty).toBe(false);
    expect(result.current.baseVersion).toBe("v3");
  });

  it("undoes and redoes", () => {
    const { result } = renderHook(() => useStudioDocument({ n: 1 }));
    act(() => result.current.update({ n: 2 }));
    act(() => result.current.update({ n: 3 }));
    act(() => result.current.undo());
    expect(result.current.doc).toEqual({ n: 2 });
    act(() => result.current.redo());
    expect(result.current.doc).toEqual({ n: 3 });
  });

  it("drops a redo branch once a new edit lands", () => {
    const { result } = renderHook(() => useStudioDocument({ n: 1 }));
    act(() => result.current.update({ n: 2 }));
    act(() => result.current.undo());
    act(() => result.current.update({ n: 9 }));
    expect(result.current.canRedo).toBe(false);
  });

  it("bounds the history so a page builder cannot leak memory through undo", () => {
    const { result } = renderHook(() =>
      useStudioDocument({ n: 0 }, { limit: 3 }),
    );
    for (let i = 1; i <= 10; i += 1) {
      act(() => result.current.update({ n: i }));
    }
    expect(result.current.historyDepth).toBe(3);
  });

  it("ignores an update that changes nothing", () => {
    const same = { n: 1 };
    const { result } = renderHook(() => useStudioDocument(same));
    act(() => result.current.update(same));
    expect(result.current.canUndo).toBe(false);
  });
});
