import React from "react";
import { getLatestRelease } from "@/lib/releases";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeatureExplorerSection } from "@/components/FeatureExplorerSection";
import { StatementSection } from "@/components/StatementSection";
import { CapabilitiesSection } from "@/components/CapabilitiesSection";
import { ComparisonSection } from "@/components/ComparisonSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";

export const revalidate = 900;

export default async function HomePage() {
  const release = await getLatestRelease();

  return (
    <div className="min-h-screen bg-[var(--or-canvas)] text-[var(--or-ink)]">
      <Navbar />

      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <FeatureExplorerSection />
        <StatementSection />
        <CapabilitiesSection />
        <ComparisonSection />
        <FaqSection />
      </main>

      <Footer latestTag={release.tagName} />
    </div>
  );
}
