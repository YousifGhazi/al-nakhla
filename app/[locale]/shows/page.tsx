import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ShowsGrid from "@/components/shows/shows-grid";
import TodayShows from "@/components/shows/today-shows";
import DaySchedulePicker from "@/components/shows/day-schedule-picker";
import ShowsPagination from "@/components/shows/shows-pagination";
import { List } from "lucide-react";
import {
  ShowListResponse,
  ShowTodayResponse,
  ShowScheduleResponse,
  DayOfWeek,
} from "@/types/shows";

const API_BASE_URL = "https://api.palm-fm.cloud/api";

interface ShowsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    day?: string;
    featured?: string;
  }>;
}

async function getShows(
  page: number = 1,
  day?: string,
  featured?: boolean
): Promise<ShowListResponse | null> {
  try {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("per_page", "12");
    if (day) params.set("day", day);
    if (featured !== undefined) params.set("featured", featured.toString());

    const response = await fetch(`${API_BASE_URL}/shows?${params.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch shows");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching shows:", error);
    return null;
  }
}

async function getTodayShows(): Promise<ShowTodayResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/shows/today`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch today shows");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching today shows:", error);
    return null;
  }
}

async function getSchedule(): Promise<ShowScheduleResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/shows/schedule`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch schedule");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: ShowsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ShowsPage" });

  const title = t("pageTitle");
  const description = t("heroDescription");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: locale === "ar" ? "النخلة إف إم" : "Al Nakhla FM",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/shows`,
      languages: {
        ar: "/ar/shows",
        en: "/en/shows",
      },
    },
  };
}

export default async function ShowsPage({
  params,
  searchParams,
}: ShowsPageProps) {
  const { locale } = await params;
  const { page: pageParam, day, featured } = await searchParams;

  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const isFeatured = featured === "true" ? true : undefined;

  // Fetch all data in parallel
  const [showsData, todayData, scheduleData] = await Promise.all([
    getShows(currentPage, day, isFeatured),
    getTodayShows(),
    getSchedule(),
  ]);

  const t = await getTranslations({ locale, namespace: "ShowsPage" });

  // Day translations
  const dayTranslations: Record<DayOfWeek, string> = {
    sunday: t("sunday"),
    monday: t("monday"),
    tuesday: t("tuesday"),
    wednesday: t("wednesday"),
    thursday: t("thursday"),
    friday: t("friday"),
    saturday: t("saturday"),
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-linear-to-r from-primary-700 via-primary-800 to-primary-700 text-white py-16">
          <div className="container mx-auto px-4 md:px-8">
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

        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 space-y-12">
          {/* Today's Shows Section */}
          {todayData && (
            <section>
              <TodayShows
                shows={todayData.data}
                day={todayData.meta.day}
                date={todayData.meta.date}
                locale={locale}
                translations={{
                  todayShows: t("todayShows"),
                  onAirToday: t("onAirToday"),
                  viewDetails: t("viewDetails"),
                  hostedBy: t("hostedBy"),
                  noShowsToday: t("noShowsToday"),
                  live: t("live"),
                }}
              />
            </section>
          )}

          {/* Schedule by Day Section */}
          {scheduleData && (
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <DaySchedulePicker
                schedule={scheduleData.data}
                locale={locale}
                translations={{
                  selectDay: t("selectDay"),
                  showsFor: t("showsFor"),
                  noShowsForDay: t("noShowsForDay"),
                  viewDetails: t("viewDetails"),
                  hostedBy: t("hostedBy"),
                  days: dayTranslations,
                }}
              />
            </section>
          )}

          {/* All Shows Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <List className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {t("allShows")}
              </h2>
            </div>

            <ShowsGrid
              shows={showsData?.data || []}
              locale={locale}
              translations={{
                live: t("live"),
                liveNow: t("liveNow"),
                viewDetails: t("viewDetails"),
                hostedBy: t("hostedBy"),
                airTime: t("airTime"),
                days: t("days"),
                aboutShow: t("aboutShow"),
                contactInfo: t("contactInfo"),
                callUs: t("callUs"),
                whatsapp: t("whatsapp"),
                favorite: t("favorite"),
                share: t("share"),
                noShows: t("noShows"),
                noShowsDescription: t("noShowsDescription"),
              }}
            />

            {/* Pagination */}
            {showsData?.meta && (
              <ShowsPagination
                meta={showsData.meta}
                locale={locale}
                baseUrl="/shows"
                translations={{
                  page: t("page"),
                  of: t("of"),
                  previous: t("previous"),
                  next: t("next"),
                }}
              />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
