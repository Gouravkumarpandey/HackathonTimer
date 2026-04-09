"use client";

import { useState } from "react";
import "../Timer.css";

type TimerAction = "start" | "stop" | "reset";

export default function StopTimerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleAction = async (action: TimerAction) => {
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/timer", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const result = (await response.json()) as { success?: boolean; message?: string };

      if (result.success) {
        const fallbackMessage =
          action === "start"
            ? "Timer has been resumed."
            : action === "stop"
              ? "Timer has been paused."
              : "Timer has been reset.";
        setMessage(result.message ?? fallbackMessage);
        return;
      }

      setMessage(result.message ?? "Action could not be completed.");
    } catch {
      setMessage("Network error. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="game-container">
      <div className="background-layer" style={{ backgroundImage: "url(/background.webp)" }} />

      <div className="title-container">
        <img src="/Titleimag.png" alt="Stop Timer Panel" className="main-title" />
      </div>

      <div className="center-stage">
        <img src="/scenery.webp" alt="Stage" className="scenery-asset" />

        <div className="launch-overlay" style={{ top: "40%", zIndex: 30 }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => handleAction("start")}
              disabled={isSubmitting}
              className="launch-btn"
              style={{ width: "150px", minHeight: "84px", padding: "8px 14px" }}
            >
              <span className="launch-btn-label">
                <span>Resume</span>
                <span>Timer</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleAction("stop")}
              disabled={isSubmitting}
              className="launch-btn"
              style={{ width: "150px", minHeight: "84px", padding: "8px 14px" }}
            >
              <span className="launch-btn-label">
                <span>Stop</span>
                <span>Timer</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleAction("reset")}
              disabled={isSubmitting}
              className="launch-btn"
              style={{ width: "150px", minHeight: "84px", padding: "8px 14px" }}
            >
              <span className="launch-btn-label">
                <span>Reset</span>
                <span>Timer</span>
              </span>
            </button>
          </div>

          {message ? <p className="status-text">{message}</p> : null}
        </div>
      </div>

      <div className="dragon-container">
        <img src="/dragon.webp" alt="Dragon" className="dragon-img" />
      </div>

      <div className="builder-container">
        <img src="/builder.webp" alt="Builder" className="builder-img" />
      </div>

      <div className="goblin-container">
        <img src="/goblin.webp" alt="Goblin" className="goblin-img" />
      </div>

      <div className="gold-storage-container">
        <img src="/goldstorage.webp" alt="Gold" className="gold-storage-img" />
      </div>

      <div className="village-builder-container">
        <img src="/villagebuilder.webp" alt="Village Builder" className="village-builder-img" />
      </div>
    </div>
  );
}
