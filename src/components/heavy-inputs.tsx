"use client";

import { useState, useRef, type FC, type ReactNode } from "react";
import { Upload, FileText, Image as ImageIcon, Check } from "lucide-react";

// ── FileUpload ────────────────────────────────────────
export interface FileUploadProps {
  onFileSelect?: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
}

export const FileUpload: FC<FileUploadProps> = ({ onFileSelect, accept, multiple }) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
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
        onChange={(e) => onFileSelect?.(e.target.files)}
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

export const ImageUpload: FC<ImageUploadProps> = ({ value, onChange }) => {
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
        onChange={(e) => {
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

export const RichTextEditor: FC<EditorProps> = ({ value = "", onChange, placeholder = "Rich text content..." }) => {
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
        onChange={(e) => onChange?.(e.target.value)}
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

export const CodeEditor: FC<EditorProps> = ({ value = "", onChange, placeholder = "// Code editor..." }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
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

export const MarkdownEditor: FC<EditorProps> = ({ value = "", onChange, placeholder = "# Markdown..." }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
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

export const SignaturePad: FC<SignaturePadProps> = ({ onSave }) => {
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
        onMouseMove={(e) => {
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
