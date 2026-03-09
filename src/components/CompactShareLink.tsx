"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface CompactShareLinkProps {
  timerId: string;
}

export default function CompactShareLink({ timerId }: CompactShareLinkProps) {
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
      // Fallback
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {viewUrl && (
        <div className="rounded-lg border border-slate-200 bg-white p-2">
          <QRCodeSVG value={viewUrl} size={80} />
        </div>
      )}
      <button
        onClick={handleCopy}
        className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
      >
        {copied ? "Copied!" : "Copy URL"}
      </button>
    </div>
  );
}
