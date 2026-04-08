"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type TimerState = {
  started: boolean;
  startTime: number | null;
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
  const [now, setNow] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadTimer() {
      const res = await fetch("/api/timer", { cache: "no-store" });
      const data = (await res.json()) as TimerState;
      if (isActive) setTimer(data);
    }

    loadTimer();
    setMounted(true);
    setNow(Date.now());

    const interval = setInterval(() => setNow(Date.now()), 1000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, []);

  const countdown = useMemo(() => {
    if (!mounted || !timer.started || !timer.startTime) return HACKATHON_DURATION_MS;

    return Math.max(0, timer.startTime + HACKATHON_DURATION_MS - now);
  }, [mounted, now, timer.started, timer.startTime]);

  const displayTimer = mounted && timer.started ? formatTime(countdown) : "--:--:--";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-3 py-6 font-sans sm:px-6">
      <Image src="/background.webp" alt="Clash background" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/50 to-black/75" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.14),transparent_45%)]" />

      <Image
        src="/scenery.webp"
        alt="Village scenery"
        width={1600}
        height={500}
        className="pointer-events-none absolute bottom-0 left-1/2 z-[1] h-auto w-[1300px] max-w-none -translate-x-1/2 opacity-70"
      />
      <Image
        src="/villagebuilder.webp"
        alt="Village Builder"
        width={320}
        height={320}
        className="pointer-events-none absolute left-1/2 top-2 z-[2] hidden h-auto w-36 -translate-x-1/2 opacity-85 md:block lg:w-44"
      />

      <main className="relative z-10 w-full max-w-4xl rounded-3xl border border-amber-100/60 bg-black/45 px-4 py-6 shadow-2xl backdrop-blur-[4px] sm:px-8 sm:py-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Image
            src="/arka_jain_logo.png"
            alt="Organizer logo"
            width={220}
            height={88}
            className="h-auto w-32 sm:w-44"
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
            <div className="w-full rounded-xl border border-amber-200/40 bg-zinc-950/70 px-3 py-4 text-center shadow-inner sm:px-8 sm:py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/80">Battle Clock</p>
              <span className="text-4xl font-mono font-bold tracking-widest text-lime-300 sm:text-6xl">{displayTimer}</span>
              <p className="mt-3 text-sm text-zinc-200 sm:text-base">
                {timer.started ? "War has begun. Build fast." : "Waiting for launch..."}
              </p>
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
