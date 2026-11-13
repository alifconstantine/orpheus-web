"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { HeadingReveal } from "./Reveal";

const FAQ_ITEMS = [
  {
    q: "Is Orpheus free and completely ad-free?",
    a: "Yes. Orpheus removes audio/video pre-roll ads cleanly and integrates SponsorBlock to skip sponsored or non-music segments automatically — with no subscription fees or telemetry.",
  },
  {
    q: "Which lyrics and translation engines are supported?",
    a: "Orpheus supports SimpMusic Lyrics, LRCLIB, Musixmatch, and YouTube captions with word-by-word RichSync karaoke timing, automatic Romanization, and AI translation.",
  },
  {
    q: "Do my YouTube Music playlists and subscriptions stay synced?",
    a: "Signing in via your YouTube Music session is optional and kept locally on your device. When connected, your mixes, liked songs, subscriptions, and playlists stay synchronized.",
  },
  {
    q: "How do desktop updates work on Windows, macOS, and Linux?",
    a: "Orpheus Desktop builds are packaged with Hydraulic Conveyor. Windows MSIX and macOS Sparkle packages support fast delta self-updates, while Linux distributes self-contained portable packages.",
  },
  {
    q: "Can I customize the interface between Liquid Glass and Material 3?",
    a: "Yes. Under settings you can switch between Blur Liquid Glass (featuring dynamic OKLab cover-derived colors across the mini player and widgets) and Material 3 Expressive styling.",
  },
  {
    q: "Where is my listening analytics and Wrapped data stored?",
    a: "Every play count, top artist stat, and yearly Wrapped report is computed strictly on-device in your local database. Nothing is uploaded or sold to analytics brokers.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="or-section" id="faq">
      <div className="or-shell">
        <HeadingReveal>
          <h2 className="or-title">Frequently asked questions</h2>
        </HeadingReveal>

        <div className="or-faq">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q} className="or-faq-item">
                <h3>
                  <button
                    type="button"
                    id={`or-faq-q-${idx}`}
                    aria-expanded={isOpen}
                    aria-controls={`or-faq-a-${idx}`}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="or-faq-question"
                  >
                    <span>{item.q}</span>
                    <Plus size={20} className="or-faq-plus" data-open={isOpen} />
                  </button>
                </h3>
                <div
                  id={`or-faq-a-${idx}`}
                  role="region"
                  aria-labelledby={`or-faq-q-${idx}`}
                  hidden={!isOpen}
                >
                  <p className="or-faq-answer">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
