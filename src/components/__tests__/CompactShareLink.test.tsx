import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CompactShareLink from "../CompactShareLink";

describe("CompactShareLink", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: { origin: "https://example.com" },
      writable: true,
    });
  });

  it("renders QR code", () => {
    render(<CompactShareLink timerId="abc123" />);
    const svg = document.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders Copy URL button", () => {
    render(<CompactShareLink timerId="abc123" />);
    expect(screen.getByText("Copy URL")).toBeInTheDocument();
  });

  it("copies URL and shows Copied! on click", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    render(<CompactShareLink timerId="abc123" />);
    await user.click(screen.getByText("Copy URL"));
    expect(writeText).toHaveBeenCalledWith(
      "https://example.com/view/abc123"
    );
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });
});
