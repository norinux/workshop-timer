import { describe, it, expect } from "vitest";
import { toEmbedUrl } from "../slides";

describe("toEmbedUrl", () => {
  it("converts /edit URL to embed URL", () => {
    const url =
      "https://docs.google.com/presentation/d/1AbC_dEf-gH/edit#slide=id.p";
    expect(toEmbedUrl(url)).toBe(
      "https://docs.google.com/presentation/d/1AbC_dEf-gH/embed?start=false&loop=false&delayms=60000"
    );
  });

  it("converts /pub URL to embed URL", () => {
    const url =
      "https://docs.google.com/presentation/d/1AbC_dEf-gH/pub?start=false";
    expect(toEmbedUrl(url)).toBe(
      "https://docs.google.com/presentation/d/1AbC_dEf-gH/embed?start=false&loop=false&delayms=60000"
    );
  });

  it("handles already embed URL", () => {
    const url =
      "https://docs.google.com/presentation/d/1AbC_dEf-gH/embed?start=true";
    expect(toEmbedUrl(url)).toBe(
      "https://docs.google.com/presentation/d/1AbC_dEf-gH/embed?start=false&loop=false&delayms=60000"
    );
  });

  it("returns null for invalid URL", () => {
    expect(toEmbedUrl("https://example.com")).toBeNull();
    expect(toEmbedUrl("not a url")).toBeNull();
    expect(toEmbedUrl("")).toBeNull();
  });
});
