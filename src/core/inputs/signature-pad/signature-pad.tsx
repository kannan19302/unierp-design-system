"use client";

import {
  useRef,
  useState,
  useId,
  forwardRef,
  useImperativeHandle,
  type MouseEvent,
  type TouchEvent,
  type ChangeEvent,
} from "react";
import { RotateCcw, PenTool, Type } from "lucide-react";
import { cn } from "../../utils/cn";
import styles from "./signature-pad.module.css";

export type SignaturePadDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export type SignatureMode = "draw" | "type";

export interface SignaturePadProps {
  id?: string;
  onSave?: (dataUrl: string) => void;
  width?: number;
  height?: number;
  disabled?: boolean;
  density?: SignaturePadDensity;
  label?: string;
  description?: string;
  error?: string;
  invalid?: boolean;
  required?: boolean;
  className?: string;
}

const DENSITY_DIMENSIONS: Record<SignaturePadDensity, { width: number; height: number }> = {
  "ultra-compact": { width: 240, height: 72 },
  compact: { width: 280, height: 96 },
  standard: { width: 340, height: 120 },
  comfortable: { width: 420, height: 160 },
};

/**
 * SignaturePad provides an HTML5 canvas drawing surface for electronic signatures,
 * along with an accessible keyboard-usable typed signature alternative.
 *
 * @maturity stable
 */
export const SignaturePad = forwardRef<HTMLCanvasElement, SignaturePadProps>(({
  id: customId,
  onSave,
  width: customWidth,
  height: customHeight,
  disabled = false,
  density = "standard",
  label,
  description,
  error,
  invalid = false,
  required = false,
  className = "",
}, ref) => {
  const generatedId = useId();
  const inputId = customId || `sig-pad-${generatedId}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const descId = description ? `${inputId}-desc` : undefined;
  const combinedDescribedBy = [descId, errorId].filter(Boolean).join(" ") || undefined;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<SignatureMode>("draw");
  const [typedSignature, setTypedSignature] = useState("");
  const [drawing, setDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  const defaultDims = DENSITY_DIMENSIONS[density];
  const width = customWidth ?? defaultDims.width;
  const height = customHeight ?? defaultDims.height;

  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

  const renderTypedToCanvas = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!text.trim()) {
      onSave?.("");
      return;
    }

    const fontSize = density === "ultra-compact" ? 18 : density === "compact" ? 22 : 28;
    ctx.font = `italic ${fontSize}px "Brush Script MT", "Caveat", "Segoe Script", cursive, sans-serif`;
    ctx.fillStyle =
      getComputedStyle(canvas).getPropertyValue("--color-text-primary").trim() ||
      "#1e293b";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    onSave?.(canvas.toDataURL());
  };

  const clear = () => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setHasContent(false);
      setTypedSignature("");
      onSave?.("");
    }
  };

  const getCoordinates = (
    clientX: number,
    clientY: number,
    canvas: HTMLCanvasElement,
  ): { x: number; y: number } => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (clientX: number, clientY: number) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setDrawing(true);
    setHasContent(true);
    const { x, y } = getCoordinates(clientX, clientY, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (clientX: number, clientY: number) => {
    if (!drawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = density === "ultra-compact" ? 1.5 : 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const strokeColor =
      getComputedStyle(canvas).getPropertyValue("--color-text-primary").trim() ||
      "#1e293b";
    ctx.strokeStyle = strokeColor;

    const { x, y } = getCoordinates(clientX, clientY, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (disabled || !drawing) return;
    setDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSave?.(canvas.toDataURL());
    }
  };

  const handleTypedChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setTypedSignature(text);
    setHasContent(Boolean(text.trim()));
    renderTypedToCanvas(text);
  };

  // Mouse Handlers
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    startDrawing(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    draw(e.clientX, e.clientY);
  };

  // Touch Handlers
  const handleTouchStart = (e: TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    if (touch) {
      e.preventDefault();
      startDrawing(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    if (touch) {
      e.preventDefault();
      draw(touch.clientX, touch.clientY);
    }
  };

  return (
    <div
      className={cn(styles.container, disabled && styles.disabled, className)}
      data-density={density}
    >
      {label && (
        <div className={styles.labelRow}>
          <span className={styles.label}>
            {label}
            {required && <span className={styles.requiredIndicator} aria-hidden="true"> *</span>}
          </span>
        </div>
      )}

      {description && (
        <div id={descId} className={styles.description}>
          {description}
        </div>
      )}

      <div className={styles.modeTabs} role="tablist" aria-label="Signature input mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "draw"}
          aria-controls={`${inputId}-draw-panel`}
          className={cn(styles.modeTab, mode === "draw" && styles.modeTabActive)}
          onClick={() => setMode("draw")}
          disabled={disabled}
        >
          <PenTool size={12} aria-hidden="true" />
          <span>Draw</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "type"}
          aria-controls={`${inputId}-type-panel`}
          className={cn(styles.modeTab, mode === "type" && styles.modeTabActive)}
          onClick={() => setMode("type")}
          disabled={disabled}
        >
          <Type size={12} aria-hidden="true" />
          <span>Type</span>
        </button>
      </div>

      <div
        id={`${inputId}-draw-panel`}
        role="tabpanel"
        aria-hidden={mode !== "draw"}
        style={{ display: mode === "draw" ? "inline-flex" : "none" }}
        className={cn(styles.canvasWrapper, (invalid || error) && styles.canvasError)}
      >
        <canvas
          ref={canvasRef}
          id={inputId}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={stopDrawing}
          className={styles.canvas}
          aria-label={label ? `Digital signature drawing pad for ${label}` : "Digital signature drawing pad"}
          aria-invalid={invalid || Boolean(error) ? "true" : undefined}
          aria-describedby={combinedDescribedBy}
        />
        <div className={styles.baselineGuide} aria-hidden="true" />
      </div>

      {mode === "type" && (
        <div
          id={`${inputId}-type-panel`}
          role="tabpanel"
          style={{ width: `${width}px` }}
          className={cn(styles.canvasWrapper, styles.typeContainer, (invalid || error) && styles.canvasError)}
        >
          <label htmlFor={`${inputId}-type-input`} className={styles.label}>
            Type your full legal name:
          </label>
          <input
            id={`${inputId}-type-input`}
            type="text"
            value={typedSignature}
            onChange={handleTypedChange}
            placeholder="e.g. Jane Doe"
            disabled={disabled}
            aria-invalid={invalid || Boolean(error) ? "true" : undefined}
            aria-describedby={combinedDescribedBy}
            className={styles.typedInput}
          />
          <div className={styles.typedPreviewBox} aria-hidden="true">
            <span className={styles.typedPreview}>
              {typedSignature.trim() ? typedSignature : "Signature Preview"}
            </span>
          </div>
        </div>
      )}

      <div className={styles.footer} style={{ maxWidth: `${width}px` }}>
        <div className={styles.hintSection}>
          <PenTool size={12} className={styles.hintIcon} aria-hidden="true" />
          <span className={styles.hint}>
            {mode === "draw" ? "Sign above the baseline" : "Typed signature legally valid"}
          </span>
        </div>

        <button
          type="button"
          onClick={clear}
          disabled={disabled || !hasContent}
          className={styles.clearBtn}
          aria-label="Clear Signature"
        >
          <RotateCcw size={12} aria-hidden="true" />
          <span>Clear Signature</span>
        </button>
      </div>

      {error && (
        <span id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

SignaturePad.displayName = "SignaturePad";
