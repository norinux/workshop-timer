import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TimerControls from "../TimerControls";
import { TimerState } from "@/lib/timer";

function makeTimer(overrides: Partial<TimerState> = {}): TimerState {
  return {
    id: "test",

    duration: 300,
    remaining: 300,
    status: "idle",
    ...overrides,
  };
}

describe("TimerControls", () => {
  it("shows Start button when idle", () => {
    render(
      <TimerControls
        timer={makeTimer({ status: "idle" })}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />
    );
    expect(screen.getByText("Start")).toBeInTheDocument();
  });

  it("shows Pause button when running", () => {
    render(
      <TimerControls
        timer={makeTimer({ status: "running" })}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />
    );
    expect(screen.getByText("Pause")).toBeInTheDocument();
  });

  it("shows Resume button when paused", () => {
    render(
      <TimerControls
        timer={makeTimer({ status: "paused" })}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />
    );
    expect(screen.getByText("Resume")).toBeInTheDocument();
  });

  it("calls onStart when Start is clicked", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(
      <TimerControls
        timer={makeTimer({ status: "idle" })}
        onStart={onStart}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />
    );
    await user.click(screen.getByText("Start"));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it("calls onPause when Pause is clicked", async () => {
    const user = userEvent.setup();
    const onPause = vi.fn();
    render(
      <TimerControls
        timer={makeTimer({ status: "running" })}
        onStart={vi.fn()}
        onPause={onPause}
        onReset={vi.fn()}
      />
    );
    await user.click(screen.getByText("Pause"));
    expect(onPause).toHaveBeenCalledOnce();
  });

  it("calls onReset when Reset is clicked", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(
      <TimerControls
        timer={makeTimer({ status: "running" })}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={onReset}
      />
    );
    await user.click(screen.getByText("Reset"));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it("disables Start button when finished", () => {
    render(
      <TimerControls
        timer={makeTimer({ status: "finished", remaining: 0 })}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
      />
    );
    expect(screen.getByText("Start")).toBeDisabled();
  });
});
