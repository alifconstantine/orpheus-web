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
  const winPrimary = findAsset((a) => a.platform === "windows" && !a.name.toLowerCase().endsWith(".zip"));
  const winZip = findAsset((a) => a.platform === "windows" && a.name.toLowerCase().endsWith(".zip"));
  const linuxAsset = findAsset((a) => a.platform === "linux");

  return {
    macos: [
      {
        id: "mac-arm64",
        label: "macOS (Apple Silicon)",
        badge: macArm?.format ?? ".dmg",
        sizeLabel: macArm?.sizeLabel ?? release.tagName,
        url: macArm?.url ?? release.htmlUrl,
        available: Boolean(macArm || release.isLive),
      },
      {
        id: "mac-x64",
        label: "macOS (Intel)",
        badge: macX64?.format ?? ".dmg",
        sizeLabel: macX64?.sizeLabel ?? release.tagName,
        url: macX64?.url ?? release.htmlUrl,
        available: Boolean(macX64 || release.isLive),
      },
    ],
    windows: [
      {
        id: "win-x64",
        label: "Windows (64-bit Installer)",
        badge: winPrimary?.format ?? ".msix",
        sizeLabel: winPrimary?.sizeLabel ?? release.tagName,
        url: winPrimary?.url ?? release.htmlUrl,
        available: Boolean(winPrimary || release.isLive),
      },
      {
        id: "win-zip",
        label: "Windows (Portable Archive)",
        badge: winZip?.format ?? ".zip",
        sizeLabel: winZip?.sizeLabel ?? release.tagName,
        url: winZip?.url ?? release.htmlUrl,
        available: Boolean(winZip || release.isLive),
      },
    ],
    linux: [
      {
        id: "linux-appimage",
        label: "Linux (x86_64 Package)",
        badge: linuxAsset?.format ?? ".AppImage",
        sizeLabel: linuxAsset?.sizeLabel ?? release.tagName,
        url: linuxAsset?.url ?? release.htmlUrl,
        available: Boolean(linuxAsset || release.isLive),
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
      id: "android-full",
      label: "Android (Universal APK)",
      badge: ".apk",
      sizeLabel: release.tagName,
      url: release.htmlUrl,
      available: release.isLive,
    },
    {
      id: "android-foss",
      label: "Android (FOSS Edition)",
      badge: ".apk",
      sizeLabel: release.tagName,
      url: release.htmlUrl,
      available: release.isLive,
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

      {items.map((item) => (
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
      ))}
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
            Desktop installers and silent delta updates are built cleanly via Hydraulic Conveyor. All
            published packages originate directly from{" "}
            <span className="font-medium text-[var(--or-ink)]">alifconstantine/orpheus-release</span>.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--or-line)] pt-3 text-xs text-[var(--or-ink-faint)]">
            <span className="flex items-center gap-1.5">
              <PackageCheck size={14} className="text-[var(--or-accent)]" />
              <span>Packaged with Conveyor</span>
            </span>
            <a
              href="https://hydraulic.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--or-accent)] hover:underline"
            >
              hydraulic.dev
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
