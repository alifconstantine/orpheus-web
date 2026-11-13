"use client";

import React from "react";
import Link from "next/link";
import { RELEASE_LATEST_URL, RELEASE_PAGE_URL } from "@/lib/releases";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Gallery", href: "/#gallery" },
      { label: "Compare", href: "/#comparison" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Design & Audio",
    links: [
      { label: "Liquid Glass Mode", href: "/#gallery" },
      { label: "Material 3 Expressive", href: "/#gallery" },
      { label: "10-Band Equalizer", href: "/#features" },
      { label: "RichSync Lyrics", href: "/#features" },
    ],
  },
  {
    heading: "Platforms",
    links: [
      { label: "Windows Installer", href: "/download?os=windows" },
      { label: "macOS (.dmg)", href: "/download?os=macos" },
      { label: "Linux (.deb / AppImage)", href: "/download?os=linux" },
      { label: "Android APK", href: "/download?os=android" },
    ],
  },
  {
    heading: "Releases",
    links: [
      { label: "Download Page", href: "/download" },
      { label: "GitHub Releases", href: RELEASE_PAGE_URL, external: true },
      { label: "Latest Build Tag", href: RELEASE_LATEST_URL, external: true },
      { label: "Source Code", href: "https://github.com/alifconstantine/orpheus", external: true },
    ],
  },
];

export function Footer({ latestTag }: { latestTag: string }) {
  return (
    <footer className="or-footer">
      <div className="or-shell-wide">
        <div className="or-footer-grid">
          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="or-footer-heading">{col.heading}</h3>
              <ul className="or-footer-links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="or-footer-link"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="or-footer-link">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="or-footer-bottom">
          <div className="flex items-center gap-3">
            <img
              src="/images/circle-app-icon.png"
              alt="Orpheus Icon"
              width={22}
              height={22}
              className="h-5 w-5 rounded-full"
            />
            <span>
              Orpheus Music Player · Release{" "}
              <strong className="text-[var(--or-ink)]">{latestTag}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span>
              Packaged with{" "}
              <a
                href="https://hydraulic.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--or-accent)] hover:underline"
              >
                Conveyor
              </a>
            </span>
            <span>·</span>
            <span>Kotlin Multiplatform &amp; Compose</span>
          </div>
        </div>

        {/* Clean Single-Word Masthead */}
        <div className="or-footer-masthead" aria-hidden="true">
          Orpheus
        </div>
      </div>
    </footer>
  );
}
