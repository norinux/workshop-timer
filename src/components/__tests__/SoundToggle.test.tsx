import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SoundToggle from "../SoundToggle";

vi.mock("@/lib/sound", () => ({
  isMuted: vi.fn(() => false),
  setMuted: vi.fn(),
}));

import { isMuted, setMuted } from "@/lib/sound";

describe("SoundToggle", () => {
  beforeEach(() => {
    vi.mocked(isMuted).mockReturnValue(false);
    vi.mocked(setMuted).mockClear();
  });

  it("renders sound on state by default", () => {
    render(<SoundToggle />);
    expect(screen.getByLabelText("Sound on")).toBeInTheDocument();
  });

  it("toggles to muted on click", async () => {
    const user = userEvent.setup();
    render(<SoundToggle />);
    await user.click(screen.getByLabelText("Sound on"));
    expect(setMuted).toHaveBeenCalledWith(true);
    expect(screen.getByLabelText("Sound off")).toBeInTheDocument();
  });

  it("toggles back to unmuted on second click", async () => {
    const user = userEvent.setup();
    render(<SoundToggle />);
    await user.click(screen.getByLabelText("Sound on"));
    await user.click(screen.getByLabelText("Sound off"));
    expect(setMuted).toHaveBeenCalledWith(false);
    expect(screen.getByLabelText("Sound on")).toBeInTheDocument();
  });

  it("renders muted state when isMuted returns true", () => {
    vi.mocked(isMuted).mockReturnValue(true);
    render(<SoundToggle />);
    expect(screen.getByLabelText("Sound off")).toBeInTheDocument();
  });
});
