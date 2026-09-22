import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useStudioDocument } from "./use-studio-document";

describe("useStudioDocument Hook", () => {
  it("tracks document edits, dirty state, and manages undo/redo stack", () => {
    const { result } = renderHook(() =>
      useStudioDocument({ title: "Draft 1" }, { version: "v1.0" })
    );

    expect(result.current.doc.title).toBe("Draft 1");
    expect(result.current.dirty).toBe(false);
    expect(result.current.canUndo).toBe(false);

    act(() => {
      result.current.update({ title: "Draft 2" });
    });

    expect(result.current.doc.title).toBe("Draft 2");
    expect(result.current.dirty).toBe(true);
    expect(result.current.canUndo).toBe(true);

    act(() => {
      result.current.undo();
    });

    expect(result.current.doc.title).toBe("Draft 1");
    expect(result.current.canRedo).toBe(true);

    act(() => {
      result.current.redo();
    });

    expect(result.current.doc.title).toBe("Draft 2");
  });
});
