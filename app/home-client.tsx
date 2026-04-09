"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type TimerState = {
  started: boolean;
  startTime: number | null;
  remainingMs?: number;
};

const HACKATHON_DURATION_MS = 24 * 60 * 60 * 1000;

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export default function HomeClient() {
  const [timer, setTimer] = useState<TimerState>({ started: false, startTime: null });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let isActive = true;

    async function loadTimer() {
      try {
        const res = await fetch("/api/timer", { cache: "no-store" });
        const data = (await res.json()) as TimerState;
        if (isActive) {
          setTimer(data);
        }
      } catch {
        // Keep existing UI state on transient network failures.
      }
    }

    loadTimer();

    const clockInterval = setInterval(() => setNow(Date.now()), 1000);
    const syncInterval = setInterval(loadTimer, 1500);

    const handleFocus = () => {
      loadTimer();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      isActive = false;
      clearInterval(clockInterval);
      clearInterval(syncInterval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  const countdown = useMemo(() => {
    const baseRemainingMs = timer.remainingMs ?? HACKATHON_DURATION_MS;

    if (!now || !timer.started || !timer.startTime) return baseRemainingMs;

    return Math.max(0, timer.startTime + baseRemainingMs - now);
  }, [now, timer.started, timer.startTime, timer.remainingMs]);

  const hasTimerProgress = (timer.remainingMs ?? HACKATHON_DURATION_MS) < HACKATHON_DURATION_MS;
  const displayTimer = timer.started || hasTimerProgress ? formatTime(countdown) : "--:--:--";

  const timerMessage = timer.started
    ? "War has begun. Build fast."
    : hasTimerProgress
      ? "Timer paused. Waiting to resume..."
      : "Waiting for launch...";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-3 py-6 font-sans sm:px-6">
      <Image src="/background.webp" alt="Clash background" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/50 to-black/75" />
      <div className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.14),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 z-2 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_14%,rgba(240,198,96,0.26),transparent_38%)]" />
        <Image
          src="/cloud.svg"
          alt="Background cloud"
          width={1800}
          height={900}
          className="absolute left-1/2 top-[-52%] h-auto w-[145vw] max-w-none -translate-x-1/2 opacity-30"
        />
        <Image
          src="/cloud.svg"
          alt="Left mist cloud"
          width={1000}
          height={600}
          className="absolute -left-[24%] top-[46%] h-auto w-[68vw] max-w-none opacity-28"
        />
        <Image
          src="/clou2.svg"
          alt="Right mist cloud"
          width={1000}
          height={600}
          className="absolute -right-[28%] top-[40%] h-auto w-[66vw] max-w-none opacity-24"
        />
      </div>

      <Image
        src="/dragon.webp"
        alt="Dragon"
        width={500}
        height={500}
        className="pointer-events-none fixed right-[-2%] top-[5%] z-12 hidden h-auto w-125 md:block"
      />
      <Image
        src="/builder.webp"
        alt="Builder"
        width={620}
        height={620}
        className="pointer-events-none fixed -bottom-5 right-0 z-15 hidden h-auto w-155 max-w-[82vw] drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] md:block"
      />
      <Image
        src="/goblin.webp"
        alt="Goblin"
        width={440}
        height={440}
        className="pointer-events-none fixed -bottom-12.5 left-32.5 z-11 hidden h-auto w-110 max-w-[48vw] drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] md:block"
      />
      <Image
        src="/goldstorage.webp"
        alt="Gold"
        width={620}
        height={620}
        className="pointer-events-none fixed -bottom-46.5 -left-35.5 z-8 hidden h-auto w-155 max-w-[62vw] drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] md:block"
      />
      <Image
        src="/villagebuilder.webp"
        alt="Village Builder"
        width={430}
        height={430}
        className="pointer-events-none absolute left-[40%] top-[74%] z-9 hidden h-auto w-107.5 max-w-[50vw] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] md:block"
      />

      <main className="relative z-10 w-full max-w-4xl rounded-3xl border border-amber-100/60 bg-black/45 px-4 py-6 shadow-2xl backdrop-blur-xs sm:px-8 sm:py-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Image
            src="/arka_jain_logo.png"
            alt="Organizer logo"
            width={220}
            height={88}
            className="h-auto w-39 sm:w-49"
          />
          <div className="rounded-full border border-amber-200/50 bg-amber-400/20 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-amber-100 sm:text-xs">
            CLASH MODE
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.3fr_0.9fr]">
          <section className="rounded-2xl border border-white/20 bg-zinc-900/45 p-4 sm:p-6">
            <Image
              src="/Titleimag.png"
              alt="Hackathon Title"
              width={420}
              height={120}
              className="mx-auto mb-5 h-auto w-full max-w-xs sm:max-w-md"
              priority
            />
            <h1 className="mb-3 text-center text-xl font-extrabold tracking-wide text-amber-100 sm:text-3xl">
              24-Hour Hackathon Timer
            </h1>
            <div className="relative w-full overflow-hidden rounded-xl border border-amber-200/40 bg-zinc-950/70 px-3 py-4 text-center shadow-inner sm:px-8 sm:py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/80">Battle Clock</p>
              <span className="text-4xl font-mono font-bold tracking-widest text-lime-300 sm:text-6xl">{displayTimer}</span>
              <p className="mt-3 text-sm text-zinc-200 sm:text-base">{timerMessage}</p>
            </div>

            <a
              href={timer.started ? "/problem-statement.txt" : undefined}
              download={timer.started ? "problem-statement.txt" : undefined}
              className={`mt-4 block w-full rounded-xl px-6 py-3 text-center text-base font-bold text-white transition-all sm:text-lg ${
                timer.started ? "cursor-pointer bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-gray-500"
              }`}
              tabIndex={timer.started ? 0 : -1}
              aria-disabled={!timer.started}
              onClick={(e) => {
                if (!timer.started) e.preventDefault();
              }}
            >
              Download Problem Statement
            </a>
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-amber-100/25 bg-zinc-900/55 p-4">
            <Image src="/icons.svg" alt="Clash icons" width={240} height={60} className="mx-auto h-auto w-32 opacity-95" />
            <div className="rounded-xl border border-white/15 bg-black/25 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Campus Quest</p>
              <p className="mt-1 text-sm text-zinc-200">Code. Build. Pitch. Conquer in 24 hours.</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-black/25 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Team Energy</p>
              <p className="mt-1 text-sm text-zinc-200">Fuel up, collaborate, and ship real ideas.</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-black/25 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Final Raid</p>
              <p className="mt-1 text-sm text-zinc-200">Demo hard before the clock hits zero.</p>
            </div>
            <p className="pt-1 text-center text-xs text-zinc-300">Hack Horizon 2.0 • College Edition</p>
          </section>
        </div>

        <div className="mt-5 flex items-center justify-center">
          <div className="rounded-full border border-amber-200/40 bg-black/35 px-4 py-1 text-[10px] uppercase tracking-[0.25em] text-amber-100 sm:text-xs">
            Build like a clan, win like champions
          </div>
        </div>
      </main>

    </div>
  );
}
