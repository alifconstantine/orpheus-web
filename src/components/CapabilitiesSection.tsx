"use client";

import React, { useState } from "react";
import { HeadingReveal } from "./Reveal";

const COLLECTION_VIEWS = [
  {
    id: "mixes",
    label: "Mix for you",
    src: "/screenshots/mix-for-you.png",
    caption: "Personalized replay mixes and Discover mixes synced directly from YouTube Music.",
  },
  {
    id: "artists",
    label: "Artists",
    src: "/screenshots/artists-sync.png",
    caption: "Deep artist pages with subscriber metrics, top tracks, releases, and one-tap follow sync.",
  },
  {
    id: "playlists",
    label: "Unlimited Playlists",
    src: "/screenshots/unlimited-playlist.png",
    caption: "Build offline-ready custom collections alongside favorited YouTube Music playlists.",
  },
  {
    id: "alerts",
    label: "Release Alerts",
    src: "/screenshots/notifications.png",
    caption: "Automatic new-single notifications from the artists you follow.",
  },
] as const;

const DESIGN_FRAMES = [
  {
    title: "Blur Liquid Glass",
    src: "/screenshots/ui-liquid-glass.png",
  },
  {
    title: "Material 3 Expressive",
    src: "/screenshots/ui-material3.png",
  },
  {
    title: "Glass Playlist Header",
    src: "/screenshots/playlist-glass.png",
  },
];

export function CapabilitiesSection() {
  const [collectionIndex, setCollectionIndex] = useState(0);
  const currentCollection = COLLECTION_VIEWS[collectionIndex] ?? COLLECTION_VIEWS[0];

  return (
    <section className="or-section" id="gallery">
      <div className="or-shell-wide">
        <HeadingReveal>
          <h2 className="or-title">Designed with clarity, never clutter</h2>
          <p className="or-subtitle">
            Real screens captured directly from Orpheus — pairing adaptive color science with fast,
            predictable ergonomics.
          </p>
        </HeadingReveal>

        <div className="or-capabilities">
          {/* Row 1: Dual UI Modes + OKLab Surface Adaptation */}
          <article className="or-capability">
            <div className="or-capability-copy">
              <h3 className="or-capability-title">
                Blur Liquid Glass or Material 3 Expressive — your call
              </h3>
              <p className="or-capability-description">
                Orpheus extracts palette anchors directly from active album artwork and clamps
                perceptual OKLab lightness so white controls stay readable in bright daylight and
                midnight sessions alike — across the player, playlists, desktop Mini Player, and
                Android Glance widgets.
              </p>
            </div>

            <div className="or-capability-visual grid grid-cols-3 gap-3 rounded-2xl border border-[var(--or-line)] bg-[var(--or-surface-muted)] p-4">
              {DESIGN_FRAMES.map((frame) => (
                <figure
                  key={frame.title}
                  className="overflow-hidden rounded-xl border border-[var(--or-line)] bg-white"
                >
                  <img
                    src={frame.src}
                    alt={frame.title}
                    loading="lazy"
                    className="block h-auto w-full object-cover"
                  />
                </figure>
              ))}
            </div>
          </article>

          {/* Row 2: Zero-Telemetry Analytics */}
          <article className="or-capability is-reversed">
            <div className="or-capability-copy">
              <h3 className="or-capability-title">
                On-device analytics &amp; yearly Wrapped
              </h3>
              <p className="or-capability-description">
                Track your top songs, listening minutes, peak listening days, and custom Wrapped
                cards computed 100% locally in your encrypted on-device Room/SQLite database. No
                cloud tracking pixels, no selling taste profiles.
              </p>
            </div>

            <div className="or-capability-visual grid grid-cols-2 gap-4 rounded-2xl border border-[var(--or-line)] bg-[var(--or-surface-muted)] p-5">
              <div className="overflow-hidden rounded-xl border border-[var(--or-line)] bg-white">
                <img
                  src="/screenshots/analytics-local.png"
                  alt="Orpheus local listening analytics"
                  loading="lazy"
                  className="block h-auto w-full"
                />
              </div>
              <div className="overflow-hidden rounded-xl border border-[var(--or-line)] bg-white">
                <img
                  src="/screenshots/free-no-ads.png"
                  alt="Orpheus free and ad-free home experience"
                  loading="lazy"
                  className="block h-auto w-full"
                />
              </div>
            </div>
          </article>

          {/* Row 3: Interactive Library & Discovery Explorer */}
          <article className="or-capability">
            <div className="or-capability-copy">
              <h3 className="or-capability-title">
                Mixes, followed artists, unlimited playlists &amp; podcasts
              </h3>
              <p className="or-capability-description">
                {currentCollection.caption} Browse podcasts cleanly with video or background audio,
                organize unlimited offline playlists, and never miss a new release.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {COLLECTION_VIEWS.map((view, idx) => (
                  <button
                    key={view.id}
                    type="button"
                    onClick={() => setCollectionIndex(idx)}
                    className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                      idx === collectionIndex
                        ? "border-[var(--or-ink)] bg-[var(--or-ink)] text-[var(--or-canvas)]"
                        : "border-[var(--or-line)] bg-[var(--or-surface)] text-[var(--or-ink-muted)] hover:border-[var(--or-line-strong)] hover:text-[var(--or-ink)]"
                    }`}
                  >
                    {view.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="or-capability-visual grid grid-cols-2 items-center gap-4 rounded-2xl border border-[var(--or-line)] bg-[var(--or-surface-muted)] p-5">
              <div className="overflow-hidden rounded-xl border border-[var(--or-line)] bg-white">
                <img
                  src={currentCollection.src}
                  alt={currentCollection.label}
                  loading="lazy"
                  className="block h-auto w-full"
                />
              </div>
              <div className="overflow-hidden rounded-xl border border-[var(--or-line)] bg-white">
                <img
                  src="/screenshots/podcasts.png"
                  alt="Orpheus podcasts screen"
                  loading="lazy"
                  className="block h-auto w-full"
                />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
