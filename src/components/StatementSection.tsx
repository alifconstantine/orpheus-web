"use client";

import React from "react";
import { ScrollTextReveal } from "./Reveal";

export function StatementSection() {
  return (
    <section className="or-statement">
      <div className="or-shell-wide">
        <h2 className="or-statement-text">
          <ScrollTextReveal
            text="Pure sound without noise — combining OKLab tonal adaptation, zero telemetry analytics, and desktop-class control across every device."
            emphasisWord="noise"
          />
        </h2>
      </div>
    </section>
  );
}
