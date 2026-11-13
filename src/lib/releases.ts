export const RELEASE_REPO = "alifconstantine/orpheus-release";
export const RELEASE_API_LATEST = `https://api.github.com/repos/${RELEASE_REPO}/releases/latest`;
export const RELEASE_API_LIST = `https://api.github.com/repos/${RELEASE_REPO}/releases?per_page=5`;
export const RELEASE_PAGE_URL = `https://github.com/${RELEASE_REPO}/releases`;
export const RELEASE_LATEST_URL = `https://github.com/${RELEASE_REPO}/releases/latest`;

export type PlatformKind = "windows" | "macos-arm64" | "macos-x64" | "linux" | "android" | "other";

export interface RawGithubAsset {
  id: number;
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  content_type?: string;
}

export interface RawGithubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body?: string;
  prerelease: boolean;
  assets: RawGithubAsset[];
}

export interface CategorizedAsset {
  id: number;
  name: string;
  platform: PlatformKind;
  label: string;
  sublabel: string;
  format: string;
  sizeBytes: number;
  sizeLabel: string;
  downloads: number;
  url: string;
}

export interface OrpheusReleaseData {
  tagName: string;
  title: string;
  publishedAt: string | null;
  htmlUrl: string;
  body: string;
  isLive: boolean;
  assets: CategorizedAsset[];
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "—";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export function classifyAsset(asset: RawGithubAsset): CategorizedAsset {
  const lower = asset.name.toLowerCase();

  if (lower.includes("windows") || lower.endsWith(".exe") || lower.endsWith(".msix")) {
    const isExe = lower.endsWith(".exe");
    const isZip = lower.endsWith(".zip");
    return {
      id: asset.id,
      name: asset.name,
      platform: "windows",
      label: isZip ? "Windows Portable" : "Windows (x64)",
      sublabel: isExe
        ? "Windows 10/11 (x64 · Installer)"
        : isZip
          ? "Windows 10/11 (x64 · Archive)"
          : "Windows 10/11 (x64 · MSIX)",
      format: isZip ? "ZIP" : isExe ? "EXE" : lower.split(".").pop()?.toUpperCase() || "EXE",
      sizeBytes: asset.size,
      sizeLabel: formatBytes(asset.size),
      downloads: asset.download_count,
      url: asset.browser_download_url,
    };
  }

  if (lower.endsWith(".dmg") || lower.includes("mac")) {
    const isArm = lower.includes("aarch64") || lower.includes("arm64") || lower.includes("apple");
    const isIntel = lower.includes("x64") || lower.includes("amd64") || lower.includes("x86_64");
    return {
      id: asset.id,
      name: asset.name,
      platform: isArm ? "macos-arm64" : "macos-x64",
      label: isArm ? "macOS (Apple Silicon)" : isIntel ? "macOS (Intel)" : "macOS Universal",
      sublabel: isArm ? "M1 / M2 / M3 / M4 · macOS 12+" : "x86_64 · macOS 12+",
      format: "DMG",
      sizeBytes: asset.size,
      sizeLabel: formatBytes(asset.size),
      downloads: asset.download_count,
      url: asset.browser_download_url,
    };
  }

  if (lower.endsWith(".deb")) {
    return {
      id: asset.id,
      name: asset.name,
      platform: "linux",
      label: "Linux (Debian / Ubuntu)",
      sublabel: "amd64 · sudo apt install",
      format: "DEB",
      sizeBytes: asset.size,
      sizeLabel: formatBytes(asset.size),
      downloads: asset.download_count,
      url: asset.browser_download_url,
    };
  }

  if (lower.endsWith(".appimage") || lower.includes("linux")) {
    return {
      id: asset.id,
      name: asset.name,
      platform: "linux",
      label: "Linux Portable",
      sublabel: "x86_64 glibc · Universal AppImage",
      format: "AppImage",
      sizeBytes: asset.size,
      sizeLabel: formatBytes(asset.size),
      downloads: asset.download_count,
      url: asset.browser_download_url,
    };
  }

  if (lower.endsWith(".apk")) {
    let label = "Android (Universal APK)";
    let sublabel = "Android 8.0+ · Universal";
    if (lower.includes("foss")) {
      label = "Android APK (FOSS)";
      sublabel = "Zero proprietary SDKs";
    } else if (lower.includes("vivo")) {
      label = "Android APK (Vivo Edition)";
      sublabel = "Vivo optimization build";
    } else if (lower.includes("full")) {
      label = "Android APK (Full)";
      sublabel = "Recommended mobile build";
    }
    return {
      id: asset.id,
      name: asset.name,
      platform: "android",
      label,
      sublabel,
      format: "APK",
      sizeBytes: asset.size,
      sizeLabel: formatBytes(asset.size),
      downloads: asset.download_count,
      url: asset.browser_download_url,
    };
  }

  return {
    id: asset.id,
    name: asset.name,
    platform: "other",
    label: asset.name,
    sublabel: "Release Artifact",
    format: asset.name.split(".").pop()?.toUpperCase() || "FILE",
    sizeBytes: asset.size,
    sizeLabel: formatBytes(asset.size),
    downloads: asset.download_count,
    url: asset.browser_download_url,
  };
}

export function normalizeRelease(raw: RawGithubRelease): OrpheusReleaseData {
  return {
    tagName: raw.tag_name || "v1.0.0",
    title: raw.name || `Orpheus ${raw.tag_name || "1.0.0"}`,
    publishedAt: raw.published_at || null,
    htmlUrl: raw.html_url || RELEASE_LATEST_URL,
    body: raw.body || "",
    isLive: true,
    assets: (raw.assets || []).map(classifyAsset),
  };
}

const FALLBACK_RELEASE: OrpheusReleaseData = {
  tagName: "v1.0.0",
  title: "Orpheus 1.0.0",
  publishedAt: null,
  htmlUrl: RELEASE_PAGE_URL,
  body: "Binaries are published on GitHub Releases as soon as builds finish packaging.",
  isLive: false,
  assets: [],
};

async function getLatestReleaseFromHtml(): Promise<OrpheusReleaseData | null> {
  try {
    const latestRes = await fetch(RELEASE_LATEST_URL, {
      redirect: "follow",
      headers: { "User-Agent": "orpheus-web" },
      next: { revalidate: 300 },
    });
    if (!latestRes.ok || !latestRes.url) return null;

    const tagMatch = latestRes.url.match(/\/releases\/tag\/([^/?#]+)/);
    const tagName = tagMatch ? decodeURIComponent(tagMatch[1]) : "";
    if (!tagName) return null;

    const expandedUrl = `https://github.com/${RELEASE_REPO}/releases/expanded_assets/${encodeURIComponent(tagName)}`;
    const assetsRes = await fetch(expandedUrl, {
      headers: { "User-Agent": "orpheus-web" },
      next: { revalidate: 300 },
    });
    if (!assetsRes.ok) return null;

    const html = await assetsRes.text();
    const listItems = html.split("<li ");
    const assets: RawGithubAsset[] = [];

    for (const block of listItems) {
      const hrefMatch = block.match(
        new RegExp(`href="(/${RELEASE_REPO}/releases/download/[^"]+)"`),
      );
      if (!hrefMatch) continue;

      const relUrl = hrefMatch[1];
      const fileName = decodeURIComponent(relUrl.split("/").pop() || "");
      if (!fileName) continue;

      const sizeMatch = block.match(/>\s*([0-9]+(?:\.[0-9]+)?)\s*(Bytes|KB|MB|GB)\s*<\/span>/i);
      let sizeBytes = 0;
      if (sizeMatch) {
        const val = Number.parseFloat(sizeMatch[1]);
        const unit = sizeMatch[2].toUpperCase();
        const mul =
          unit === "GB"
            ? 1024 * 1024 * 1024
            : unit === "MB"
              ? 1024 * 1024
              : unit === "KB"
                ? 1024
                : 1;
        sizeBytes = Number.isFinite(val) ? Math.round(val * mul) : 0;
      }

      assets.push({
        id: assets.length + 1,
        name: fileName,
        size: sizeBytes,
        download_count: 0,
        browser_download_url: `https://github.com${relUrl}`,
      });
    }

    return normalizeRelease({
      tag_name: tagName,
      name: `Orpheus ${tagName}`,
      published_at: "",
      html_url: `${RELEASE_PAGE_URL}/tag/${encodeURIComponent(tagName)}`,
      body: "",
      prerelease: false,
      assets,
    });
  } catch {
    return null;
  }
}

export async function getLatestRelease(): Promise<OrpheusReleaseData> {
  try {
    const res = await fetch(RELEASE_API_LATEST, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "orpheus-web",
      },
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const json = (await res.json()) as RawGithubRelease;
      return normalizeRelease(json);
    }

    const listRes = await fetch(RELEASE_API_LIST, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "orpheus-web",
      },
      next: { revalidate: 300 },
    });

    if (listRes.ok) {
      const releases = (await listRes.json()) as RawGithubRelease[];
      if (Array.isArray(releases) && releases.length > 0) {
        return normalizeRelease(releases[0]);
      }
    }
  } catch {
    // Fall through to HTML asset endpoint when REST API is unreachable or rate-limited.
  }

  const htmlRelease = await getLatestReleaseFromHtml();
  if (htmlRelease) {
    return htmlRelease;
  }

  return FALLBACK_RELEASE;
}
