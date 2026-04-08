"use client";

import { useState } from "react";
import "../Timer.css";

export default function AdminPage() {
  const [isLaunching, setIsLaunching] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleLaunch = async () => {
    setIsLaunching(true);
    setMessage("");

    try {
      const response = await fetch("/api/timer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = (await response.json()) as { success?: boolean; started?: boolean };

      if (result.success) {
        setMessage("Hackathon launched successfully.");
        window.location.href = "/";
        return;
      }

      if (result.started) {
        setMessage("Hackathon already live. Redirecting...");
        window.location.href = "/";
        return;
      }

      setMessage("Could not launch the hackathon.");
    } catch {
      setMessage("Network error. Try again.");
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="game-container">
      <div className="background-layer" style={{ backgroundImage: "url(/background.webp)" }} />

      <div className="title-container">
        <img src="/Titleimag.png" alt="Admin Panel" className="main-title" />
      </div>

      <div className="center-stage">
        <img src="/scenery.webp" alt="Stage" className="scenery-asset" />

        <div className="launch-overlay">
          <button type="button" onClick={handleLaunch} disabled={isLaunching} className="launch-btn">
            {isLaunching ? (
              <span className="launch-btn-label">Launching...</span>
            ) : (
              <span className="launch-btn-label">
                <span>Launch</span>
                <span>Hackathon</span>
              </span>
            )}
          </button>

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
