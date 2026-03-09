"use client";

import { useState } from "react";

interface ShareLinkProps {
  timerId: string;
}

export default function ShareLink({ timerId }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);

  const viewUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/view/${timerId}`
      : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(viewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
    }
  };

  return (
    <div className="w-full max-w-md">
      <p className="mb-2 text-sm text-slate-400">Share with participants</p>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={viewUrl}
          className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-slate-300"
        />
        <button
          onClick={handleCopy}
          className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-500"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
