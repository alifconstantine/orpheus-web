"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowDownToLine,
  ArrowUpRight,
  Laptop,
  PackageCheck,
  Smartphone,
  Terminal,
} from "lucide-react";
import type { CategorizedAsset, OrpheusReleaseData } from "@/lib/releases";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

type CategoryTab = "desktop" | "mobile";

interface BuildButtonItem {
  id: string;
  label: string;
  badge: string;
  sizeLabel: string;
  url: string;
  available: boolean;
}

function resolveDesktopColumns(release: OrpheusReleaseData): {
  macos: BuildButtonItem[];
  windows: BuildButtonItem[];
  linux: BuildButtonItem[];
} {
  const findAsset = (pred: (a: CategorizedAsset) => boolean) =>
    release.assets.find(pred);

  const macArm = findAsset((a) => a.platform === "macos-arm64");
  const macX64 = findAsset((a) => a.platform === "macos-x64");
  const winExe = findAsset((a) => a.platform === "windows" && a.name.toLowerCase().endsWith(".exe"));
  const winFallback = findAsset((a) => a.platform === "windows");
  const winPrimary = winExe ?? winFallback;
  const linuxDeb = findAsset((a) => a.platform === "linux" && a.format === "DEB");
  const linuxAppImage = findAsset((a) => a.platform === "linux" && a.format !== "DEB");

  return {
    macos: [
      {
        id: "mac-arm64",
        label: "macOS (Apple Silicon)",
        badge: macArm?.format ?? ".dmg",
        sizeLabel: macArm?.sizeLabel ?? "Coming Soon",
        url: macArm?.url ?? release.htmlUrl,
        available: Boolean(macArm),
      },
      {
        id: "mac-x64",
        label: "macOS (Intel)",
        badge: macX64?.format ?? ".dmg",
        sizeLabel: macX64?.sizeLabel ?? "Coming Soon",
        url: macX64?.url ?? release.htmlUrl,
        available: Boolean(macX64),
      },
    ],
    windows: [
      {
        id: "win-x64",
        label: "Windows (x64 Installer)",
        badge: winPrimary?.format ?? ".exe",
        sizeLabel: winPrimary?.sizeLabel ?? "Coming Soon",
        url: winPrimary?.url ?? release.htmlUrl,
        available: Boolean(winPrimary),
      },
    ],
    linux: [
      {
        id: "linux-deb",
        label: "Linux (Debian / Ubuntu)",
        badge: linuxDeb?.format ?? ".deb",
        sizeLabel: linuxDeb?.sizeLabel ?? "Coming Soon",
        url: linuxDeb?.url ?? release.htmlUrl,
        available: Boolean(linuxDeb),
      },
      {
        id: "linux-appimage",
        label: "Linux (Portable AppImage)",
        badge: linuxAppImage?.format ?? ".AppImage",
        sizeLabel: linuxAppImage?.sizeLabel ?? "Coming Soon",
        url: linuxAppImage?.url ?? release.htmlUrl,
        available: Boolean(linuxAppImage),
      },
    ],
  };
}

function resolveAndroidBuilds(release: OrpheusReleaseData): BuildButtonItem[] {
  const androidAssets = release.assets.filter((a) => a.platform === "android");
  if (androidAssets.length > 0) {
    return androidAssets.map((a) => ({
      id: String(a.id),
      label: a.label,
      badge: a.format,
      sizeLabel: a.sizeLabel,
      url: a.url,
      available: true,
    }));
  }

  return [
    {
      id: "android-universal",
      label: "Android (Universal APK)",
      badge: ".apk",
      sizeLabel: "Coming Soon",
      url: release.htmlUrl,
      available: false,
    },
  ];
}

function PlatformColumn({
  title,
  highlighted,
  items,
  onSelect,
}: {
  title: string;
  highlighted?: boolean;
  items: BuildButtonItem[];
  onSelect: (item: BuildButtonItem) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1 flex items-center gap-2 px-1">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--or-ink)]">{title}</h2>
        {highlighted && (
          <span className="rounded-full border border-[var(--or-line)] bg-[var(--or-surface-muted)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--or-accent)]">
            Selected
          </span>
        )}
      </div>

      {items.map((item) =>
        item.available ? (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onSelect(item)}
            className="group flex w-full items-center justify-between rounded-2xl border border-[var(--or-line)] bg-[var(--or-surface)] p-4 text-left transition hover:border-[var(--or-line-strong)] hover:bg-[var(--or-surface-muted)]"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="truncate text-sm font-medium text-[var(--or-ink)]">
                {item.label}
              </span>
              <span className="shrink-0 rounded-md border border-[var(--or-line)] bg-[var(--or-surface-muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--or-ink-muted)]">
                {item.badge}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-xs text-[var(--or-ink-faint)]">
              <span>{item.sizeLabel}</span>
              <ArrowDownToLine
                size={14}
                className="opacity-70 transition group-hover:translate-y-0.5 group-hover:text-[var(--or-ink)] group-hover:opacity-100"
              />
            </div>
          </a>
        ) : (
          <div
            key={item.id}
            aria-disabled="true"
            className="flex w-full cursor-not-allowed items-center justify-between rounded-2xl border border-[var(--or-line)] bg-[var(--or-surface)]/60 p-4 text-left opacity-70"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="truncate text-sm font-medium text-[var(--or-ink-muted)]">
                {item.label}
              </span>
              <span className="shrink-0 rounded-md border border-[var(--or-line)] bg-[var(--or-surface-muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--or-ink-faint)]">
                {item.badge}
              </span>
            </div>
            <span className="shrink-0 rounded-full border border-[var(--or-line)] bg-[var(--or-surface-muted)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--or-ink-faint)]">
              Coming Soon
            </span>
          </div>
        ),
      )}
    </div>
  );
}

export function DownloadPageView({
  release,
  os,
}: {
  release: OrpheusReleaseData;
  os?: string;
}) {
  const initialTab: CategoryTab = os === "android" || os === "ios" ? "mobile" : "desktop";
  const [category, setCategory] = useState<CategoryTab>(initialTab);
  const [toastLabel, setToastLabel] = useState<string | null>(null);

  const desktopCols = resolveDesktopColumns(release);
  const androidBuilds = resolveAndroidBuilds(release);

  const handleSelect = (item: BuildButtonItem) => {
    setToastLabel(item.label);
    window.setTimeout(() => setToastLabel(null), 3600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--or-canvas)] text-[var(--or-ink)]">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pt-32 pb-24" id="main-content" tabIndex={-1}>
        {/* Header Hero matching Harness DownloadPage */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[var(--or-ink)] sm:text-5xl md:text-6xl">
            Download Orpheus
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-[var(--or-ink-muted)] sm:text-lg">
            Choose your installer for Windows, macOS, Linux, or Android. Latest release:{" "}
            <strong className="font-semibold text-[var(--or-ink)]">{release.tagName}</strong>.
          </p>

          {/* Segmented Desktop / Mobile Toggle */}
          <div className="mt-8 inline-flex rounded-full border border-[var(--or-line)] bg-[var(--or-surface-muted)] p-1.5">
            <button
              type="button"
              onClick={() => setCategory("desktop")}
              className={`flex cursor-pointer items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition ${
                category === "desktop"
                  ? "bg-[var(--or-surface)] font-semibold text-[var(--or-ink)]"
                  : "text-[var(--or-ink-muted)] hover:text-[var(--or-ink)]"
              }`}
            >
              <Laptop size={15} />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setCategory("mobile")}
              className={`flex cursor-pointer items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition ${
                category === "mobile"
                  ? "bg-[var(--or-surface)] font-semibold text-[var(--or-ink)]"
                  : "text-[var(--or-ink-muted)] hover:text-[var(--or-ink)]"
              }`}
            >
              <Smartphone size={15} />
              <span>Mobile</span>
            </button>
          </div>
        </div>

        {/* Downloads Columns */}
        {category === "desktop" ? (
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PlatformColumn
              title="macOS"
              highlighted={os === "macos"}
              items={desktopCols.macos}
              onSelect={handleSelect}
            />
            <PlatformColumn
              title="Windows"
              highlighted={os === "windows"}
              items={desktopCols.windows}
              onSelect={handleSelect}
            />
            <PlatformColumn
              title="Linux"
              highlighted={os === "linux"}
              items={desktopCols.linux}
              onSelect={handleSelect}
            />
          </div>
        ) : (
          <div className="mx-auto max-w-xl">
            <PlatformColumn
              title="Android"
              highlighted={os === "android"}
              items={androidBuilds}
              onSelect={handleSelect}
            />
          </div>
        )}

        {/* Release Notes & Conveyor Info Box */}
        <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-[var(--or-line)] bg-[var(--or-surface)] p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-[var(--or-ink)]">
              <Terminal size={15} className="text-[var(--or-accent)]" />
              <span>Release {release.tagName}</span>
            </span>
            <a
              href={release.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-[var(--or-accent)] hover:underline"
            >
              <span>View all builds on GitHub</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
          <p className="text-sm leading-relaxed text-[var(--or-ink-muted)]">
            Native installers for Windows (<code className="text-[var(--or-ink)]">.exe</code>), macOS (
            <code className="text-[var(--or-ink)]">.dmg</code>), Linux (
            <code className="text-[var(--or-ink)]">.deb</code> /{" "}
            <code className="text-[var(--or-ink)]">.AppImage</code>), and Android Universal APK are
            published directly from{" "}
            <span className="font-medium text-[var(--or-ink)]">alifconstantine/orpheus-release</span>.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--or-line)] pt-3 text-xs text-[var(--or-ink-faint)]">
            <span className="flex items-center gap-1.5">
              <PackageCheck size={14} className="text-[var(--or-accent)]" />
              <span>Linux CLI install: sudo apt install ./orpheus.deb</span>
            </span>
            <a
              href={release.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--or-accent)] hover:underline"
            >
              GitHub Releases
            </a>
          </div>
        </div>

        {/* Back Link */}
        <p className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--or-ink-muted)] transition hover:text-[var(--or-ink)]"
          >
            <ArrowLeft size={13} />
            <span>Back to Orpheus home</span>
          </Link>
        </p>

        {/* Download Toast */}
        {toastLabel && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-[var(--or-line)] bg-[var(--or-ink)] px-5 py-3.5 text-xs text-[var(--or-canvas)] shadow-xl">
            <span className="h-2 w-2 rounded-full bg-[var(--or-accent)]" />
            <div>
              <span className="block font-semibold">Starting download</span>
              <span className="opacity-80">{toastLabel}</span>
            </div>
          </div>
        )}
      </main>

      <Footer latestTag={release.tagName} />
    </div>
  );
}
