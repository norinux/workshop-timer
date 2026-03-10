import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SlideEmbed from "../SlideEmbed";

describe("SlideEmbed", () => {
  it("renders URL input form when no embedUrl", () => {
    render(<SlideEmbed onSetSlideUrl={vi.fn()} embedUrl={null} />);
    expect(screen.getByText("Google Slides URL")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Paste Google Slides URL...")
    ).toBeInTheDocument();
    expect(screen.getByText("Embed")).toBeInTheDocument();
  });

  it("shows permission note", () => {
    render(<SlideEmbed onSetSlideUrl={vi.fn()} embedUrl={null} />);
    expect(
      screen.getByText(/リンクを知っている全員が閲覧可/)
    ).toBeInTheDocument();
  });

  it("calls onSetSlideUrl with embed URL on valid Google Slides URL", async () => {
    const user = userEvent.setup();
    const onSetSlideUrl = vi.fn();
    render(<SlideEmbed onSetSlideUrl={onSetSlideUrl} embedUrl={null} />);

    const input = screen.getByPlaceholderText("Paste Google Slides URL...");
    await user.type(
      input,
      "https://docs.google.com/presentation/d/abc123/edit"
    );
    await user.click(screen.getByText("Embed"));

    expect(onSetSlideUrl).toHaveBeenCalledWith(
      "https://docs.google.com/presentation/d/abc123/embed?start=false&loop=false&delayms=60000"
    );
  });

  it("shows error on invalid URL", async () => {
    const user = userEvent.setup();
    const onSetSlideUrl = vi.fn();
    render(<SlideEmbed onSetSlideUrl={onSetSlideUrl} embedUrl={null} />);

    const input = screen.getByPlaceholderText("Paste Google Slides URL...");
    await user.type(input, "https://example.com/not-slides");
    await user.click(screen.getByText("Embed"));

    expect(screen.getByText("Invalid Google Slides URL")).toBeInTheDocument();
    expect(onSetSlideUrl).not.toHaveBeenCalled();
  });

  it("calls onSetSlideUrl(null) when input is empty", async () => {
    const user = userEvent.setup();
    const onSetSlideUrl = vi.fn();
    render(<SlideEmbed onSetSlideUrl={onSetSlideUrl} embedUrl={null} />);

    await user.click(screen.getByText("Embed"));
    expect(onSetSlideUrl).toHaveBeenCalledWith(null);
  });

  it("renders iframe when embedUrl is provided", () => {
    const embedUrl =
      "https://docs.google.com/presentation/d/abc123/embed?start=false&loop=false&delayms=60000";
    render(<SlideEmbed onSetSlideUrl={vi.fn()} embedUrl={embedUrl} />);

    expect(screen.getByTitle("Google Slides")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  it("calls onSetSlideUrl(null) when Remove is clicked", async () => {
    const user = userEvent.setup();
    const onSetSlideUrl = vi.fn();
    const embedUrl =
      "https://docs.google.com/presentation/d/abc123/embed?start=false&loop=false&delayms=60000";
    render(<SlideEmbed onSetSlideUrl={onSetSlideUrl} embedUrl={embedUrl} />);

    await user.click(screen.getByText("Remove"));
    expect(onSetSlideUrl).toHaveBeenCalledWith(null);
  });
});
