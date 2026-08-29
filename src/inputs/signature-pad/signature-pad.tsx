"use client";

import { useRef, useState, type MouseEvent, type FC } from "react";
import styles from "./signature-pad.module.css";

export interface SignaturePadProps {
  id?: string;
  onSave?: (dataUrl: string) => void;
  width?: number;
  height?: number;
  disabled?: boolean;
  className?: string;
}

export const SignaturePad: FC<SignaturePadProps> = ({
  id,
  onSave,
  width = 320,
  height = 120,
  disabled = false,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);

  const clear = () => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      onSave?.("");
    }
  };

  const handleMouseDown = () => {
    if (disabled) return;
    setDrawing(true);
  };

  const handleMouseUp = () => {
    if (disabled) return;
    setDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSave?.(canvas.toDataURL());
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1e293b";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  return (
    <div
      className={`${styles.container} ${disabled ? styles.disabled : ""} ${className}`.trim()}
    >
      <canvas
        ref={canvasRef}
        id={id}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={styles.canvas}
        aria-label="Digital signature pad"
      />
      <div className={styles.footer}>
        <span className={styles.hint}>Sign above the baseline</span>
        <button
          type="button"
          onClick={clear}
          disabled={disabled}
          className={styles.clearBtn}
        >
          Clear Signature
        </button>
      </div>
    </div>
  );
};
