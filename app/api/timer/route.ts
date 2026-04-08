import { NextResponse } from "next/server";

let timerState: { started: boolean; startTime: number | null } = {
  started: false,
  startTime: null,
};

export async function GET() {
  return NextResponse.json(timerState);
}

export async function POST(request: Request) {
  // Only allow starting if not already started
  if (!timerState.started) {
    timerState = {
      started: true,
      startTime: Date.now(),
    };
    return NextResponse.json({ success: true, ...timerState });
  }
  return NextResponse.json({ success: false, ...timerState });
}
