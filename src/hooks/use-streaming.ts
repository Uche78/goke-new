"use client";

import { useState, useCallback } from "react";

interface UseStreamingReturn {
  text: string;
  isStreaming: boolean;
  error: string | null;
  stream: (url: string, body: object) => Promise<string>;
  reset: () => void;
}

export function useStreaming(): UseStreamingReturn {
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setText("");
    setError(null);
  }, []);

  const stream = useCallback(async (url: string, body: object): Promise<string> => {
    setIsStreaming(true);
    setError(null);
    setText("");

    let fullText = "";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Request failed" }));
        const e = new Error(err.error ?? "Request failed") as Error & { status?: number; payload?: unknown };
        e.status = response.status;
        e.payload = err;
        throw e;
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullText += chunk;
        setText((prev) => prev + chunk);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      throw err; // re-throw so callers can handle specific error types
    } finally {
      setIsStreaming(false);
    }

    return fullText;
  }, []);

  return { text, isStreaming, error, stream, reset };
}
