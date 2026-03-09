import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TimerDisplay from "../TimerDisplay";
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

describe("TimerDisplay", () => {
  it("renders the time formatted correctly", () => {
    render(<TimerDisplay timer={makeTimer({ remaining: 125 })} />);
    expect(screen.getByText("02:05")).toBeInTheDocument();
  });

  it("shows TIME'S UP when finished", () => {
    render(
      <TimerDisplay
        timer={makeTimer({ remaining: 0, status: "finished" })}
      />
    );
    expect(screen.getByText("TIME'S UP!")).toBeInTheDocument();
  });

  it("does not show TIME'S UP when running", () => {
    render(
      <TimerDisplay timer={makeTimer({ remaining: 100, status: "running" })} />
    );
    expect(screen.queryByText("TIME'S UP!")).not.toBeInTheDocument();
  });

  it("shows correct status text", () => {
    const { rerender } = render(
      <TimerDisplay timer={makeTimer({ status: "idle" })} />
    );
    expect(screen.getByText("Ready")).toBeInTheDocument();

    rerender(<TimerDisplay timer={makeTimer({ status: "running" })} />);
    expect(screen.getByText("Running")).toBeInTheDocument();

    rerender(<TimerDisplay timer={makeTimer({ status: "paused" })} />);
    expect(screen.getByText("Paused")).toBeInTheDocument();

    rerender(
      <TimerDisplay timer={makeTimer({ status: "finished", remaining: 0 })} />
    );
    expect(screen.getByText("Finished")).toBeInTheDocument();
  });

  it("has accessible timer role", () => {
    render(<TimerDisplay timer={makeTimer()} />);
    expect(screen.getByRole("timer")).toBeInTheDocument();
  });

  it("has a progress bar", () => {
    render(
      <TimerDisplay timer={makeTimer({ duration: 300, remaining: 150 })} />
    );
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "50");
  });
});
