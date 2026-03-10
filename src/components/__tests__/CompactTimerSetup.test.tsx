import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CompactTimerSetup from "../CompactTimerSetup";

describe("CompactTimerSetup", () => {
  it("renders all preset buttons", () => {
    render(
      <CompactTimerSetup onSetDuration={vi.fn()} currentDuration={300} />
    );
    expect(screen.getByText("1m")).toBeInTheDocument();
    expect(screen.getByText("3m")).toBeInTheDocument();
    expect(screen.getByText("5m")).toBeInTheDocument();
    expect(screen.getByText("10m")).toBeInTheDocument();
    expect(screen.getByText("15m")).toBeInTheDocument();
    expect(screen.getByText("20m")).toBeInTheDocument();
    expect(screen.getByText("30m")).toBeInTheDocument();
  });

  it("calls onSetDuration when preset is clicked", async () => {
    const user = userEvent.setup();
    const onSetDuration = vi.fn();
    render(
      <CompactTimerSetup onSetDuration={onSetDuration} currentDuration={300} />
    );
    await user.click(screen.getByText("10m"));
    expect(onSetDuration).toHaveBeenCalledWith(10);
  });

  it("highlights the currently selected preset", () => {
    render(
      <CompactTimerSetup onSetDuration={vi.fn()} currentDuration={300} />
    );
    const button5m = screen.getByText("5m");
    expect(button5m.className).toContain("bg-blue-600");
  });

  it("does not highlight non-selected presets", () => {
    render(
      <CompactTimerSetup onSetDuration={vi.fn()} currentDuration={300} />
    );
    const button10m = screen.getByText("10m");
    expect(button10m.className).not.toContain("bg-blue-600");
  });

  it("allows custom minutes input", async () => {
    const user = userEvent.setup();
    const onSetDuration = vi.fn();
    render(
      <CompactTimerSetup onSetDuration={onSetDuration} currentDuration={300} />
    );
    const input = screen.getByPlaceholderText("Min");
    await user.type(input, "7");
    await user.click(screen.getByText("Set"));
    expect(onSetDuration).toHaveBeenCalledWith(7);
  });

  it("does not call onSetDuration for invalid input (0)", async () => {
    const user = userEvent.setup();
    const onSetDuration = vi.fn();
    render(
      <CompactTimerSetup onSetDuration={onSetDuration} currentDuration={300} />
    );
    const input = screen.getByPlaceholderText("Min");
    await user.type(input, "0");
    await user.click(screen.getByText("Set"));
    expect(onSetDuration).not.toHaveBeenCalled();
  });

  it("clears custom input after successful submit", async () => {
    const user = userEvent.setup();
    render(
      <CompactTimerSetup onSetDuration={vi.fn()} currentDuration={300} />
    );
    const input = screen.getByPlaceholderText("Min") as HTMLInputElement;
    await user.type(input, "12");
    await user.click(screen.getByText("Set"));
    expect(input.value).toBe("");
  });
});
