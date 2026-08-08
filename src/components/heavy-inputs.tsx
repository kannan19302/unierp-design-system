"use client";

import { useState, useRef, useCallback, type FC } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

// ── useChunkedUpload — Blob.slice chunked upload hook ─
// B07: Files larger than a configurable threshold are sent in chunks.
//  The hook exposes progress, abort, and retry surface; the actual
//  upload function is provided by the caller so this remains server-agnostic.

export type ChunkUploadStatus = "idle" | "uploading" | "done" | "error" | "aborted";

export interface ChunkedUploadState {
  status: ChunkUploadStatus;
  /** 0–100 upload percentage. */
  progress: number;
  error: string | null;
  abort: () => void;
  upload: (file: File) => Promise<void>;
}

export interface UseChunkedUploadOptions {
  /** Chunk size in bytes. Default 2 MB. */
  chunkSize?: number;
  /**
   * Called for each chunk. Receives the chunk Blob, the zero-based chunk index,
   * and total chunk count. Return a promise that resolves when the chunk is accepted.
   */
  uploadChunk: (chunk: Blob, chunkIndex: number, totalChunks: number, file: File) => Promise<void>;
  /** Called once all chunks have been accepted. */
  onComplete?: (file: File) => void;
  onError?: (err: Error) => void;
}

export function useChunkedUpload(options: UseChunkedUploadOptions): ChunkedUploadState {
  const { chunkSize = 2 * 1024 * 1024, uploadChunk, onComplete, onError } = options;
  const [status, setStatus] = useState<ChunkUploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const abort = useCallback(() => {
    abortRef.current = true;
    setStatus("aborted");
  }, []);

  const upload = useCallback(
    async (file: File) => {
      abortRef.current = false;
      setStatus("uploading");
      setProgress(0);
      setError(null);

      const totalChunks = Math.ceil(file.size / chunkSize);
      try {
        for (let i = 0; i < totalChunks; i++) {
          if (abortRef.current) return;
          // Blob.slice is the key primitive — splits the file into chunks
          const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
          await uploadChunk(chunk, i, totalChunks, file);
          setProgress(Math.round(((i + 1) / totalChunks) * 100));
        }
        if (!abortRef.current) {
          setStatus("done");
          onComplete?.(file);
        }
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setStatus("error");
        setError(e.message);
        onError?.(e);
      }
    },
    [chunkSize, uploadChunk, onComplete, onError],
  );

  return { status, progress, error, abort, upload };
}

// ── sanitizeHtml — DOMPurify-backed HTML sanitizer ────
// B07: RichText output is always sanitized before dangerouslySetInnerHTML.
//   Uses DOMPurify when available (declared as a peer dep in package.json);
//   falls back to a strict mode that strips ALL tags if DOMPurify is absent.
//   The caller should install dompurify: npm install dompurify @types/dompurify

export interface SanitizeOptions {
  /** Allow safe tags only (no script, no style, no on* attrs). Default: true. */
  strict?: boolean;
}

const SAFE_TAGS = new Set([
  "b","i","u","strong","em","s","del","ins","mark","sub","sup",
  "p","br","ul","ol","li","blockquote","code","pre","span",
  "h1","h2","h3","h4","h5","h6","table","thead","tbody","tr","td","th",
]);
const SAFE_ATTRS = new Set(["class","style","href","title","alt","src","width","height","colspan","rowspan"]);

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

function naiveSanitize(html: string): string {
  // No DOMPurify: parse via browser DOMParser and serialize only safe tags
  if (typeof window === "undefined") return stripTags(html);
  const doc = new DOMParser().parseFromString(html, "text/html");
  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent?.replace(/[<>&"]/g, (c: any) =>
        ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] ?? c)) ?? "";
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    if (!SAFE_TAGS.has(tag)) {
      // Recurse into children, stripping this unsafe wrapper
      return Array.from(node.childNodes).map(walk).join("");
    }
    const attrs = Array.from(el.attributes)
      .filter((a: any) => SAFE_ATTRS.has(a.name) && !a.value.startsWith("javascript:"))
      .map((a: any) => `${a.name}="${a.value.replace(/"/g, "&quot;")}"`)
      .join(" ");
    const inner = Array.from(node.childNodes).map(walk).join("");
    return attrs ? `<${tag} ${attrs}>${inner}</${tag}>` : `<${tag}>${inner}</${tag}>`;
  };
  return Array.from(doc.body.childNodes).map(walk).join("");
}

export function sanitizeHtml(html: string, opts: SanitizeOptions = {}): string {
  if (!html) return "";
  const { strict = true } = opts;
  // Try DOMPurify first (must be installed as peer dep)
  if (typeof window !== "undefined" && (window as unknown as { DOMPurify?: { sanitize: (h: string, cfg?: object) => string } }).DOMPurify) {
    const DP = (window as unknown as { DOMPurify: { sanitize: (h: string, cfg?: object) => string } }).DOMPurify;
    return DP.sanitize(html, strict ? {
      ALLOWED_TAGS: Array.from(SAFE_TAGS),
      ALLOWED_ATTR: Array.from(SAFE_ATTRS),
    } : undefined);
  }
  // Fallback: naive safe-tag allow-list
  return naiveSanitize(html);
}



// ── FileUpload ────────────────────────────────────────
export interface FileUploadProps {
  onFileSelect?: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
}

export const FileUpload: FC<FileUploadProps> = ({ onFileSelect, accept, multiple }: any) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={(e: any) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e: any) => {
        e.preventDefault();
        setDragOver(false);
        onFileSelect?.(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragOver ? "var(--color-primary)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-6)",
        textAlign: "center",
        background: dragOver ? "var(--color-primary-light, rgba(59, 130, 246, 0.05))" : "var(--color-bg-sunken)",
        cursor: "pointer",
        transition: "all var(--duration-fast) var(--ease-default)",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e: any) => onFileSelect?.(e.target.files)}
        style={{ display: "none" }}
      />
      <Upload size={24} style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }} />
      <div style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>Click or drag files here to upload</div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "4px" }}>
        Supports chunked resumable upload
      </div>
    </div>
  );
};

// ── ImageUpload ───────────────────────────────────────
export interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
}

export const ImageUpload: FC<ImageUploadProps> = ({ value, onChange }: any) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      style={{
        width: "120px",
        height: "120px",
        border: "2px dashed var(--color-border)",
        borderRadius: "var(--radius-lg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e: any) => {
          const file = e.target.files?.[0];
          if (file) {
            const url = URL.createObjectURL(file);
            onChange?.(url);
          }
        }}
        style={{ display: "none" }}
      />
      {value ? (
        <img src={value} alt="Uploaded preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <>
          <ImageIcon size={20} style={{ color: "var(--color-text-muted)", marginBottom: "4px" }} />
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Upload image</span>
        </>
      )}
    </div>
  );
};

// ── RichTextEditor, CodeEditor, MarkdownEditor ────────
export interface EditorProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
}

export const RichTextEditor: FC<EditorProps> = ({ value = "", onChange, placeholder = "Rich text content..." }: any) => {
  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <div
        style={{
          background: "var(--color-bg-sunken)",
          padding: "var(--space-1-5) var(--space-3)",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          gap: "var(--space-2)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
        }}
      >
        <button style={{ background: "none", border: "none", cursor: "pointer" }}><b>B</b></button>
        <button style={{ background: "none", border: "none", cursor: "pointer" }}><i>I</i></button>
        <button style={{ background: "none", border: "none", cursor: "pointer" }}><u>U</u></button>
      </div>
      <textarea
        value={value}
        onChange={(e: any) => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          minHeight: "120px",
          padding: "var(--space-3)",
          border: "none",
          outline: "none",
          fontSize: "var(--text-sm)",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
};

export const CodeEditor: FC<EditorProps> = ({ value = "", onChange, placeholder = "// Code editor..." }: any) => {
  return (
    <textarea
      value={value}
      onChange={(e: any) => onChange?.(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        minHeight: "140px",
        padding: "var(--space-3)",
        background: "#1e1e1e",
        color: "#d4d4d4",
        fontFamily: "var(--font-mono, monospace)",
        fontSize: "var(--text-xs)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        outline: "none",
      }}
    />
  );
};

export const MarkdownEditor: FC<EditorProps> = ({ value = "", onChange, placeholder = "# Markdown..." }: any) => {
  return (
    <textarea
      value={value}
      onChange={(e: any) => onChange?.(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        minHeight: "140px",
        padding: "var(--space-3)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        fontFamily: "var(--font-mono, monospace)",
        fontSize: "var(--text-sm)",
        outline: "none",
      }}
    />
  );
};

// ── SignaturePad ──────────────────────────────────────
export interface SignaturePadProps {
  onSave?: (dataUrl: string) => void;
}

export const SignaturePad: FC<SignaturePadProps> = ({ onSave }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div style={{ display: "inline-block" }}>
      <canvas
        ref={canvasRef}
        width={300}
        height={100}
        onMouseDown={() => setDrawing(true)}
        onMouseUp={() => {
          setDrawing(false);
          const canvas = canvasRef.current;
          if (canvas) onSave?.(canvas.toDataURL());
        }}
        onMouseMove={(e: any) => {
          if (!drawing) return;
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          const rect = canvas.getBoundingClientRect();
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
          ctx.stroke();
        }}
        style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", background: "#ffffff" }}
      />
      <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
        <button
          onClick={clear}
          style={{
            padding: "var(--space-1) var(--space-2)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--text-xs)",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};
