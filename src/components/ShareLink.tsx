"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

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
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-medium text-slate-500">Share with participants</p>
      {viewUrl && (
        <div className="rounded-xl border-2 border-slate-200 bg-white p-4 shadow-sm">
          <QRCodeSVG value={viewUrl} size={180} />
        </div>
      )}
      <div className="flex w-full max-w-md gap-2">
        <input
          type="text"
          readOnly
          value={viewUrl}
          className="flex-1 rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600"
        />
        <button
          onClick={handleCopy}
          className="rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
