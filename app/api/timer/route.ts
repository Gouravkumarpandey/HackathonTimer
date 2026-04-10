import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const HACKATHON_DURATION_MS = (18 * 60 + 55) * 60 * 1000;

type TimerState = {
  started: boolean;
  paused: boolean;
  startTime: number | null;
  remainingMs: number;
};

const initialTimerState: TimerState = {
  started: true,
  paused: false,
  startTime: Date.now(),
  remainingMs: HACKATHON_DURATION_MS,
};

const globalTimer = globalThis as typeof globalThis & { __hackathonTimerState?: TimerState };

if (!globalTimer.__hackathonTimerState) {
  globalTimer.__hackathonTimerState = initialTimerState;
}

let timerState = globalTimer.__hackathonTimerState;

function updateTimerState(next: TimerState) {
  timerState = next;
  globalTimer.__hackathonTimerState = next;
}

function ensureAutoStarted() {
  if (!timerState.started && !timerState.paused && timerState.remainingMs > 0) {
    updateTimerState({
      started: true,
      paused: false,
      startTime: Date.now(),
      remainingMs:
        timerState.remainingMs === 24 * 60 * 60 * 1000 ? HACKATHON_DURATION_MS : timerState.remainingMs,
    });
  }
}

export async function GET() {
  ensureAutoStarted();
  return NextResponse.json(timerState);
}

export async function POST(request: Request) {
  ensureAutoStarted();
  let action: "start" | "stop" | "reset" = "start";

  try {
    const body = (await request.json()) as { action?: "start" | "stop" | "reset" };
    if (body?.action) {
      action = body.action;
    }
  } catch {
    // Keep backwards compatibility for requests without a JSON body.
  }

  if (action === "start") {
    // Start new or resume paused timer.
    if (!timerState.started && timerState.remainingMs > 0) {
      updateTimerState({
        ...timerState,
        started: true,
        paused: false,
        startTime: Date.now(),
      });
      return NextResponse.json({ success: true, ...timerState });
    }

    if (timerState.started) {
      return NextResponse.json({ success: false, ...timerState, message: "Timer already started." });
    }

    return NextResponse.json({ success: false, ...timerState, message: "Timer is already completed. Reset first." });
  }

  if (action === "stop") {
    if (!timerState.started) {
      return NextResponse.json({ success: true, ...timerState, message: "Timer is already paused." });
    }

    const elapsedMs = timerState.startTime ? Date.now() - timerState.startTime : 0;
    const remainingMs = Math.max(0, timerState.remainingMs - elapsedMs);

    updateTimerState({
      started: false,
      paused: true,
      startTime: null,
      remainingMs,
    });

    return NextResponse.json({ success: true, ...timerState, message: "Timer has been paused." });
  }

  updateTimerState({
    started: true,
    paused: false,
    startTime: Date.now(),
    remainingMs: HACKATHON_DURATION_MS,
  });

  return NextResponse.json({ success: true, ...timerState, message: "Timer has been reset and started." });
}