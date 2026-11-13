# Orpheus Web

Official landing page and download portal for **Orpheus** — built with **Next.js**.

## Purpose

- **Product Showcase:** Highlights Orpheus features across Android and Desktop (Liquid Glass UI, synced word-by-word lyrics, home screen widgets, audio effects/AutoEq, and listening insights).
- **Dynamic Download Links:** Fetches the latest release metadata and installer assets directly from the public [`alifconstantine/orpheus-release`](https://github.com/alifconstantine/orpheus-release) repository via the GitHub Releases API.
- **Release Notes & Changelogs:** Displays version history and platform-specific download options without exposing the private application source repository.

## Architecture

```text
alifconstantine/orpheus         (private) ──▶ Core app source code
alifconstantine/orpheus-release (public)  ──▶ Compiled APKs, desktop installers & GitHub Releases
alifconstantine/orpheus-web     (public)  ──▶ Next.js landing page & download portal
```

## Status

Repository initialized. Ready for Next.js project setup.
