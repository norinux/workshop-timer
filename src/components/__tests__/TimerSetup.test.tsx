import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimerSetup from "../TimerSetup";

describe("TimerSetup", () => {
  it("renders preset buttons", () => {
    render(
      <TimerSetup
        onSetDuration={vi.fn()}
        currentDuration={300}
      />
    );
    expect(screen.getByText("1m")).toBeInTheDocument();
    expect(screen.getByText("5m")).toBeInTheDocument();
    expect(screen.getByText("10m")).toBeInTheDocument();
    expect(screen.getByText("30m")).toBeInTheDocument();
  });

  it("calls onSetDuration when preset is clicked", async () => {
    const user = userEvent.setup();
    const onSetDuration = vi.fn();
    render(
      <TimerSetup
        onSetDuration={onSetDuration}
        currentDuration={300}
      />
    );
    await user.click(screen.getByText("10m"));
    expect(onSetDuration).toHaveBeenCalledWith(10);
  });

  it("highlights the currently selected preset", () => {
    render(
      <TimerSetup
        onSetDuration={vi.fn()}
        currentDuration={300}
      />
    );
    const button5m = screen.getByText("5m");
    expect(button5m.className).toContain("bg-blue-600");
  });

  it("allows custom minutes input", async () => {
    const user = userEvent.setup();
    const onSetDuration = vi.fn();
    render(
      <TimerSetup
        onSetDuration={onSetDuration}
        currentDuration={300}
      />
    );
    const input = screen.getByPlaceholderText("Custom minutes");
    await user.type(input, "7");
    await user.click(screen.getByText("Set"));
    expect(onSetDuration).toHaveBeenCalledWith(7);
  });
});
