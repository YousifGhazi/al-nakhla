import Header from "@/components/header";
import HeroCarousel from "@/components/hero-carousel";
import BreakingNews from "@/components/breaking-news";
import NewsCategoriesDynamic from "@/components/news-categories-dynamic";
import RadioPrograms from "@/components/radio-programs";
import FeaturedShows from "@/components/featured-shows";
import Footer from "@/components/footer";
import { News, TodayNewsResponse } from "@/types/news";
import { Show, ShowListResponse } from "@/types/shows";

const API_BASE_URL = "http://168.231.101.52:8080/api";

async function getTodayNews(limit: number = 5): Promise<News[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/news/top?limit=${limit}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch today news");
    }

    const data: TodayNewsResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching today news:", error);
    return [];
  }
}

async function getBreakingNews(): Promise<News[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/news?page=1&per_page=3&category=breaking-news&sort=-published_at`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch breaking news");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching breaking news:", error);
    return [];
  }
}

async function getFeaturedShows(limit: number = 4): Promise<Show[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/shows?page=1&per_page=${limit}&featured=true`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch featured shows");
    }

    const data: ShowListResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching featured shows:", error);
    return [];
  }
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const [todayNews, breakingNews, featuredShows] = await Promise.all([
    getTodayNews(5),
    getBreakingNews(),
    getFeaturedShows(4),
  ]);

  return (
    <>
      <Header />
      <main>
        <HeroCarousel news={todayNews} />
        <BreakingNews news={breakingNews} />
        <FeaturedShows shows={featuredShows} />
        <NewsCategoriesDynamic locale={locale} />
      </main>
      <Footer />
    </>
  );
}
