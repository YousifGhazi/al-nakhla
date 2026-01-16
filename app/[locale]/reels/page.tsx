import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ReelsGrid from "@/components/reels/reels-grid";
import {
  Reel,
  ReelsResponse,
  ReelsResponseRaw,
  normalizeMeta,
} from "@/types/reels";

const API_BASE_URL = "http://168.231.101.52:8080/api";

interface ReelsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
    reel?: string;
  }>;
}

async function getReels(
  page: number = 1,
  search?: string,
  sort?: string
): Promise<ReelsResponse | null> {
  try {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("per_page", "12");
    if (search) params.set("q", search);
    if (sort) params.set("sort", sort);

    const response = await fetch(`${API_BASE_URL}/reels?${params.toString()}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error("Failed to fetch reels");
    }

    const rawData: ReelsResponseRaw = await response.json();
    // Normalize the meta data (API returns arrays, we need single values)
    return {
      data: rawData.data,
      links: rawData.links,
      meta: normalizeMeta(rawData.meta),
    };
  } catch (error) {
    console.error("Error fetching reels:", error);
    return null;
  }
}

async function getReelById(id: string): Promise<Reel | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/reels/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Error fetching reel:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: ReelsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { reel: reelId } = await searchParams;
  const t = await getTranslations({ locale, namespace: "ReelsPage" });

  // If viewing a specific reel, generate metadata for that reel
  if (reelId) {
    const reel = await getReelById(reelId);
    if (reel) {
      return {
        title: reel.title,
        description: reel.description || t("heroDescription"),
        openGraph: {
          title: reel.title,
          description: reel.description || t("heroDescription"),
          type: "video.other",
          images: reel.thumbnail_url ? [reel.thumbnail_url] : [],
          videos: [
            {
              url: reel.stream_url,
              type: reel.mime_type,
            },
          ],
        },
        twitter: {
          card: "player",
          title: reel.title,
          description: reel.description || t("heroDescription"),
          images: reel.thumbnail_url ? [reel.thumbnail_url] : [],
        },
      };
    }
  }

  return {
    title: t("pageTitle"),
    description: t("heroDescription"),
  };
}

export default async function ReelsPage({
  params,
  searchParams,
}: ReelsPageProps) {
  const { locale } = await params;
  const {
    page: pageParam,
    q: searchQuery,
    sort,
    reel: activeReelId,
  } = await searchParams;

  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const reelsData = await getReels(currentPage, searchQuery, sort);

  // If there's an active reel ID, fetch that specific reel
  let activeReel: Reel | null = null;
  if (activeReelId) {
    activeReel = await getReelById(activeReelId);
  }

  const t = await getTranslations({ locale, namespace: "ReelsPage" });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-linear-to-r from-primary-700 via-primary-800 to-primary-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t("heroTitle")}
              </h1>
              <p className="text-lg md:text-xl text-white/80">
                {t("heroDescription")}
              </p>
            </div>
          </div>
        </section>

        {/* Reels Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <ReelsGrid
              initialReels={reelsData?.data || []}
              initialMeta={reelsData?.meta || null}
              activeReelId={activeReelId || null}
              activeReel={activeReel}
              locale={locale}
              translations={{
                views: t("views"),
                likes: t("likes"),
                share: t("share"),
                copyLink: t("copyLink"),
                linkCopied: t("linkCopied"),
                close: t("close"),
                noReels: t("noReels"),
                noReelsDescription: t("noReelsDescription"),
                loading: t("loading"),
                sortBy: t("sortBy"),
                newest: t("newest"),
                oldest: t("oldest"),
                mostViewed: t("mostViewed"),
                mostLiked: t("mostLiked"),
                searchPlaceholder: t("searchPlaceholder"),
                by: t("by"),
                page: t("page"),
                of: t("of"),
                previous: t("previous"),
                next: t("next"),
                duration: t("duration"),
                fileSize: t("fileSize"),
                comments: t("comments"),
                writeComment: t("writeComment"),
                send: t("send"),
                noComments: t("noComments"),
                beFirstToComment: t("beFirstToComment"),
                loadMore: t("loadMore"),
                like: t("like"),
                liked: t("liked"),
                usernameRequired: t("usernameRequired"),
                enterUsername: t("enterUsername"),
                usernamePlaceholder: t("usernamePlaceholder"),
                save: t("save"),
                cancel: t("cancel"),
              }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
