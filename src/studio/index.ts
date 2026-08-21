"use client";

// @kannan19302/ui/studio — the shared builder chrome for the Developer
// Platform (P8). See UI_UX_BRIEF §12.
//
// This subpath exists because layout was the part that was diverging. Thirteen
// builders shared tokens and still looked like thirteen products, because each
// one invented its own rails, its own toolbar order, its own error surface and
// its own idea of what "publish" means. Tokens cannot fix that; a frame can.

export {
  StudioShell,
  useStudioShell,
  type StudioShellProps,
  type StudioShellContextValue,
} from "./studio-shell";

export {
  StudioToolbar,
  type StudioToolbarProps,
  type StudioVerb,
} from "./studio-toolbar";

export {
  StudioPalette,
  type StudioPaletteProps,
  type PaletteGroup,
  type PaletteItem,
} from "./studio-palette";

export {
  StudioCanvas,
  useStudioCanvas,
  type StudioCanvasProps,
  type StudioCanvasContextValue,
} from "./studio-canvas";

export {
  StudioInspector,
  type StudioInspectorProps,
  type InspectorTabId,
} from "./studio-inspector";

export {
  StudioConsole,
  type StudioConsoleProps,
  type StudioProblem,
  type ProblemSeverity,
} from "./studio-console";

export {
  PublishDiffDialog,
  type PublishDiffDialogProps,
  type PublishChange,
} from "./publish-diff-dialog";

export {
  useStudioDocument,
  type StudioDocumentState,
  type UseStudioDocumentOptions,
} from "./use-studio-document";
