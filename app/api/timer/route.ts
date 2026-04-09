import { NextResponse } from "next/server";

const HACKATHON_DURATION_MS = 24 * 60 * 60 * 1000;

type TimerState = {
  started: boolean;
  startTime: number | null;
  remainingMs: number;
};

const initialTimerState: TimerState = {
  started: false,
  startTime: null,
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

export async function GET() {
  return NextResponse.json(timerState);
}

export async function POST(request: Request) {
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
      startTime: null,
      remainingMs,
    });

    return NextResponse.json({ success: true, ...timerState, message: "Timer has been paused." });
  }

  updateTimerState({
    started: false,
    startTime: null,
    remainingMs: HACKATHON_DURATION_MS,
  });

  return NextResponse.json({ success: true, ...timerState, message: "Timer has been reset." });
}
