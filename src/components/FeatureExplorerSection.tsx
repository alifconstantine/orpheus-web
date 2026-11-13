"use client";

import React, { useState, type KeyboardEvent } from "react";
import { HeadingReveal } from "./Reveal";

interface FeatureTab {
  id: string;
  title: string;
  description: string;
  image: string;
  altImage?: { label: string; src: string };
}

const FEATURE_TABS: FeatureTab[] = [
  {
    id: "lyrics",
    title: "Word-by-word synced lyrics & translation",
    description:
      "Sing along with millisecond-accurate RichSync karaoke highlights, automatic Romanization, and AI-powered translation powered by SimpMusic Lyrics, LRCLIB, and Musixmatch.",
    image: "/screenshots/lyrics-translation.png",
  },
  {
    id: "eq",
    title: "10-band equalizer & AutoEq presets",
    description:
      "Shape frequencies across 10 bands from 31 Hz to 16 kHz, dial in preamp gain, or apply studio-measured AutoEq profiles tailored to your headphones.",
    image: "/screenshots/equalizer-autoeq.png",
  },
  {
    id: "design",
    title: "Two signature UI languages",
    description:
      "Switch effortlessly between translucent Blur Liquid Glass (tinting dynamically from album artwork in OKLab space) and bold Material 3 Expressive with wavy progress scrubbers.",
    image: "/screenshots/ui-liquid-glass.png",
    altImage: {
      label: "Material 3 Expressive",
      src: "/screenshots/ui-material3.png",
    },
  },
  {
    id: "offline",
    title: "Play everywhere — cached & ad-free",
    description:
      "Download albums and playlists at original streaming quality for subway commutes, flights, and zero-signal sessions — with built-in SponsorBlock skipping non-music segments.",
    image: "/screenshots/offline-playback.png",
  },
  {
    id: "together",
    title: "Listen Together synchronized rooms",
    description:
      "Create an instant room code and listen in tight real-time lockstep with friends across clients — shared queue, shared timestamps, zero subscription paywalls.",
    image: "/screenshots/listen-together.png",
  },
];

export function FeatureExplorerSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAltDesign, setShowAltDesign] = useState(false);

  const activeTab = FEATURE_TABS[activeIndex] ?? FEATURE_TABS[0];
  const displaySrc =
    activeTab.id === "design" && showAltDesign && activeTab.altImage
      ? activeTab.altImage.src
      : activeTab.image;

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      next = (index + 1) % FEATURE_TABS.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      next = (index + FEATURE_TABS.length - 1) % FEATURE_TABS.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = FEATURE_TABS.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    setActiveIndex(next);
    document.getElementById(`or-tab-${next}`)?.focus();
  };

  return (
    <section className="or-section" id="features">
      <div className="or-shell">
        <HeadingReveal>
          <h2 className="or-title">Built for how you actually listen</h2>
          <p className="or-subtitle">
            Every surface in Orpheus is engineered for speed, audio fidelity, and distraction-free
            focus across desktop and mobile.
          </p>
        </HeadingReveal>

        <div className="or-tasks">
          {/* Left Vertical Interactive Tabs */}
          <div
            className="or-task-list"
            role="tablist"
            aria-label="Core Orpheus Features"
            aria-orientation="vertical"
          >
            {FEATURE_TABS.map((tab, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={tab.id}
                  id={`or-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="or-feature-panel"
                  tabIndex={isActive ? 0 : -1}
                  data-active={isActive}
                  onKeyDown={(e) => onKeyDown(e, index)}
                  onClick={() => {
                    setActiveIndex(index);
                    if (tab.id !== "design") setShowAltDesign(false);
                  }}
                  className="or-task-item"
                >
                  <span className="or-task-title">{tab.title}</span>
                  {isActive && <span className="or-task-description">{tab.description}</span>}
                </button>
              );
            })}
          </div>

          {/* Right Framed Screenshot Stage */}
          <div
            id="or-feature-panel"
            role="tabpanel"
            aria-labelledby={`or-tab-${activeIndex}`}
            className="or-task-stage"
          >
            {activeTab.altImage && (
              <div className="mb-4 inline-flex rounded-full border border-[var(--or-line)] bg-[var(--or-surface)] p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAltDesign(false)}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 font-medium transition ${
                    !showAltDesign
                      ? "bg-[var(--or-ink)] text-[var(--or-canvas)]"
                      : "text-[var(--or-ink-muted)] hover:text-[var(--or-ink)]"
                  }`}
                >
                  Liquid Glass
                </button>
                <button
                  type="button"
                  onClick={() => setShowAltDesign(true)}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 font-medium transition ${
                    showAltDesign
                      ? "bg-[var(--or-ink)] text-[var(--or-canvas)]"
                      : "text-[var(--or-ink-muted)] hover:text-[var(--or-ink)]"
                  }`}
                >
                  {activeTab.altImage.label}
                </button>
              </div>
            )}

            <div className="w-full max-w-[380px] overflow-hidden rounded-2xl border border-[var(--or-line)] bg-white">
              <img
                src={displaySrc}
                alt={activeTab.title}
                className="block h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
