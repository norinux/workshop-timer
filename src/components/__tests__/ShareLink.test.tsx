import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShareLink from "../ShareLink";

describe("ShareLink", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: { origin: "https://example.com" },
      writable: true,
    });
  });

  it("renders share heading", () => {
    render(<ShareLink timerId="abc123" />);
    expect(screen.getByText("Share with participants")).toBeInTheDocument();
  });

  it("displays the view URL in a readonly input", () => {
    render(<ShareLink timerId="abc123" />);
    const input = screen.getByDisplayValue(
      "https://example.com/view/abc123"
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.readOnly).toBe(true);
  });

  it("renders QR code", () => {
    render(<ShareLink timerId="abc123" />);
    // QRCodeSVG renders an SVG element
    const svg = document.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders Copy button", () => {
    render(<ShareLink timerId="abc123" />);
    expect(screen.getByText("Copy")).toBeInTheDocument();
  });

  it("copies URL and shows Copied! on click", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    render(<ShareLink timerId="abc123" />);
    await user.click(screen.getByText("Copy"));
    expect(writeText).toHaveBeenCalledWith(
      "https://example.com/view/abc123"
    );
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });
});
