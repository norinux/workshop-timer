/**
 * Convert a Google Slides share URL to an embed URL.
 *
 * Accepts:
 *   - https://docs.google.com/presentation/d/SLIDE_ID/edit...
 *   - https://docs.google.com/presentation/d/SLIDE_ID/pub...
 *   - https://docs.google.com/presentation/d/SLIDE_ID/embed...
 *
 * Returns the /embed URL, or null if invalid.
 */
export function toEmbedUrl(url: string): string | null {
  const match = url.match(
    /docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/
  );
  if (!match) return null;

  const slideId = match[1];
  return `https://docs.google.com/presentation/d/${slideId}/embed?start=false&loop=false&delayms=60000`;
}
