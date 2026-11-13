import { getLatestRelease } from "@/lib/releases";
import { DownloadPageView } from "@/components/DownloadPageView";

export const revalidate = 900;

export default async function DownloadPage({
  searchParams,
}: {
  searchParams: Promise<{ os?: string }>;
}) {
  const [release, query] = await Promise.all([getLatestRelease(), searchParams]);
  return <DownloadPageView release={release} os={query.os} />;
}
