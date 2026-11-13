"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Download, Laptop, Smartphone, Terminal } from "lucide-react";

const PLATFORM_TARGETS = [
  { id: "windows", label: "Windows", detail: "Windows 10 / 11 · x64 (.exe)", href: "/download?os=windows", icon: Laptop },
  { id: "macos", label: "macOS", detail: "Apple Silicon & Intel · Coming Soon", href: "/download?os=macos", icon: Laptop },
  { id: "linux", label: "Linux", detail: "Debian (.deb) & AppImage · Coming Soon", href: "/download?os=linux", icon: Terminal },
  { id: "android", label: "Android", detail: "Android 8+ · Universal APK", href: "/download?os=android", icon: Smartphone },
] as const;

export function HeroSection() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    window.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <section className="or-hero" id="top">
      <div className="or-hero-backdrop" aria-hidden="true" />

      <div className="or-hero-shell">
        <div className="or-hero-header">
          <h1 className="or-hero-title">Orpheus</h1>

          <p className="or-hero-subtitle">
            Stream YouTube Music and local audio with zero ads, word-by-word synced lyrics, 10-band
            AutoEq presets, and native builds for Windows, macOS, Linux, and Android.
          </p>

          {/* Primary Download CTA Dropdown */}
          <div className="mt-7 flex justify-center" ref={dropdownRef}>
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-white px-6 py-3 text-[14.5px] font-semibold text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                <Download size={16} />
                <span>Download Orpheus</span>
                <ChevronDown
                  size={15}
                  className={`opacity-70 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute left-1/2 top-full z-40 mt-2.5 w-[290px] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/15 bg-[#0d121c] p-2 text-left text-white shadow-2xl">
                  <div className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Choose Platform
                  </div>
                  <div className="mt-1 space-y-1">
                    {PLATFORM_TARGETS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/10"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sky-300">
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13.5px] font-medium text-white">{item.label}</p>
                            <p className="truncate text-[11px] text-slate-400">{item.detail}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Supported Platform Pills */}
          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-2.5"
            role="navigation"
            aria-label="Supported platforms"
          >
            {PLATFORM_TARGETS.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.id} href={item.href} className="or-hero-platform-pill">
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Real Product Capture: Desktop screenshot on desktop screens, Mobile screenshot on mobile screens */}
        <div className="w-full pt-2">
          <div className="hidden md:block">
            <div className="or-hero-shot-desktop mx-auto">
              <img
                src="/screenshots/hero-desktop.jpg"
                alt="Orpheus Desktop application showing Recently played, playlists, and Now Playing sidebar"
                width={1024}
                height={556}
                className="block h-auto w-full object-cover"
                fetchPriority="high"
              />
            </div>
          </div>

          <div className="block md:hidden">
            <div className="or-hero-shot-mobile">
              <img
                src="/screenshots/hero-mobile.jpg"
                alt="Orpheus Mobile Android home screen showing Recently played and mini player"
                width={576}
                height={1280}
                className="block h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
