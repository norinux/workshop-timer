"use client";

import { useState } from "react";
import { toEmbedUrl } from "@/lib/slides";

interface SlideEmbedProps {
  onSetSlideUrl: (embedUrl: string | null) => void;
  embedUrl: string | null;
}

export default function SlideEmbed({ onSetSlideUrl, embedUrl }: SlideEmbedProps) {
  const [inputUrl, setInputUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!inputUrl.trim()) {
      onSetSlideUrl(null);
      return;
    }

    const embed = toEmbedUrl(inputUrl.trim());
    if (!embed) {
      setError("Invalid Google Slides URL");
      return;
    }

    onSetSlideUrl(embed);
    setInputUrl("");
  };

  if (embedUrl) {
    return (
      <div className="flex w-full flex-1 flex-col">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">Google Slides</p>
          <button
            onClick={() => onSetSlideUrl(null)}
            className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50"
          >
            Remove
          </button>
        </div>
        <iframe
          src={embedUrl}
          className="w-full flex-1 rounded-xl border-2 border-slate-200"
          allowFullScreen
          title="Google Slides"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <p className="mb-1 text-sm font-medium text-slate-500">Google Slides URL</p>
      <p className="mb-2 text-xs text-slate-400">
        * 自分が開けるスライドまたはGoogle Slidesの共有設定で「リンクを知っている全員が閲覧可」にしてください
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Paste Google Slides URL..."
          className="flex-1 rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Embed
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </form>
  );
}
