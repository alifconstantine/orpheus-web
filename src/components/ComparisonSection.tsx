"use client";

import React from "react";
import { HeadingReveal } from "./Reveal";

const ROWS = [
  {
    category: "Ad-Free & SponsorBlock",
    orpheus: "100% zero audio/video ads plus automatic SponsorBlock intro, outro, and non-music skipping.",
    other: "Locked behind monthly subscriptions with manual scrubbing past sponsored segments.",
  },
  {
    category: "Lyrics & Translation",
    orpheus: "Millisecond RichSync word-by-word lyrics, Romanization, and AI translation from multiple providers — even on offline tracks.",
    other: "Basic static line sync restricted to select regions and online-only tiers.",
  },
  {
    category: "UI Craft & Widgets",
    orpheus: "Switchable Blur Liquid Glass and Material 3 Expressive themes, OKLab cover-tinted Android Glance widgets & Desktop Mini Player.",
    other: "Single rigid interface with generic rectangular media notifications.",
  },
  {
    category: "DSP & Equalizer",
    orpheus: "Built-in 10-band parametric EQ and integrated AutoEq presets for hundreds of headphone models.",
    other: "Rough 5-band sliders or completely absent on desktop apps.",
  },
  {
    category: "Privacy & Analytics",
    orpheus: "All listening history, Wrapped reports, and play statistics stay locally in your SQLite/Room database.",
    other: "Continuous behavioral telemetry synced to ad-targeting cloud backends.",
  },
];

export function ComparisonSection() {
  return (
    <section className="or-section" id="comparison">
      <div className="or-shell">
        <HeadingReveal>
          <h2 className="or-title">Why switch to Orpheus</h2>
          <p className="or-subtitle">
            Built for listeners who expect desktop-grade fidelity, transparent privacy, and native
            visual polish without compromises.
          </p>
        </HeadingReveal>

        <div className="or-comparison-wrap">
          <table className="or-comparison">
            <thead>
              <tr>
                <th scope="col">Capability</th>
                <th scope="col" data-orpheus="true">
                  Orpheus
                </th>
                <th scope="col">Standard Streaming Clients</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.category}>
                  <th scope="row">{row.category}</th>
                  <td data-orpheus="true">{row.orpheus}</td>
                  <td>{row.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
