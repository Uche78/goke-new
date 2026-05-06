"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const PENDING_KEY = "goke_pending_analysis";

export function PendingAnalysisHandler() {
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return;

    // Remove before fetching so remounts (React Strict Mode) don't double-submit
    localStorage.removeItem(PENDING_KEY);

    let pending: Record<string, unknown>;
    try {
      pending = JSON.parse(raw);
    } catch {
      return;
    }

    fetch("/api/career-analysis/save-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pending),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.analysisId) {
          router.push(`/career-analysis/results/${data.analysisId}`);
        }
      })
      .catch(() => {
        // Analysis lost — user can redo from dashboard
      });
  }, [router]);

  return null;
}
