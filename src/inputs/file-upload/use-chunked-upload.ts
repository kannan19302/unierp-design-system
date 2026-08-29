import { useState, useRef, useCallback } from "react";

export type ChunkUploadStatus = "idle" | "uploading" | "done" | "error" | "aborted";

export interface ChunkedUploadState {
  status: ChunkUploadStatus;
  progress: number;
  error: string | null;
  abort: () => void;
  upload: (file: File) => Promise<void>;
}

export interface UseChunkedUploadOptions {
  chunkSize?: number;
  uploadChunk: (chunk: Blob, chunkIndex: number, totalChunks: number, file: File) => Promise<void>;
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
    [chunkSize, uploadChunk, onComplete, onError]
  );

  return { status, progress, error, abort, upload };
}
